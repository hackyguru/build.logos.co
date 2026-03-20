"use client"

import { useState, useEffect, useRef } from 'react'
import { getImageProps } from 'next/image'
import { buildSrc } from '@studio/lib/image'
import cx from 'classnames'

/**
 * Process a Sanity image object into props suitable for getImageProps.
 */
function processImageData({
  src,
  image,
  alt = '',
  width,
  height,
  ratio,
  quality = 75,
  sizes,
  layout = 'default',
  priority = false,
  loading = 'lazy',
}) {
  if ((!src && !image) || (image && !image.asset)) return null

  if (image && !src) {
    src = ratio ? { ...image, customRatio: ratio } : image
  }

  const isStatic = typeof src === 'string'

  const imgAspectRatio =
    typeof width === 'number' && typeof height === 'number'
      ? (height / width) * 100
      : !isStatic
      ? 100 / (src?.customRatio || src?.aspectRatio)
      : null

  let imgWidth = width ?? src?.width ?? 3000
  let imgHeight = height ?? src?.height ?? (imgAspectRatio
    ? Math.round(imgWidth * imgAspectRatio) / 100
    : null)

  if (ratio && !height) {
    imgHeight = Math.round(imgWidth / ratio)
  }

  if (image?.crop && !ratio) {
    imgWidth *= 1 - (image.crop.left + image.crop.right)
    imgHeight *= 1 - (image.crop.top + image.crop.bottom)
  }

  const imgUrl = isStatic
    ? src
    : buildSrc(src, { width: imgWidth, height: imgHeight, quality })

  const imgAlt = alt || src?.alt || image?.alt || ''

  if (!imgAlt && process.env.NODE_ENV === 'development') {
    console.warn('ACCESSIBILITY: Image missing alt text:', {
      src: typeof src === 'string' ? src : src?._ref,
      component: 'Image'
    })
  }

  const finalAlt = imgAlt || ''

  const finalSizes = sizes || (() => {
    if (layout === 'cover' || layout === 'contain' || layout === 'fill') return '100vw'
    return '(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw'
  })()

  const { props: imgProps } = getImageProps({
    src: imgUrl,
    alt: finalAlt,
    width: Math.round(imgWidth),
    height: Math.round(imgHeight),
    sizes: finalSizes,
    quality,
    priority,
    loading: priority ? undefined : loading,
  })

  return {
    imgProps,
    imgWidth,
    imgHeight,
    hotspotX: image?.hotspot?.x,
    hotspotY: image?.hotspot?.y,
    priority,
    paletteBg: src?.paletteBg,
    ratio: ratio || imgWidth / imgHeight,
  }
}

const Image = ({
  className = '',
  imgClassName = '',
  alt = '',
  src,
  image,
  mobileImage,
  width,
  height,
  ratio,
  layout = 'default',
  quality = 75,
  transitionIn = true,
  colorFill = false,
  preloadColor = false,
  priority = false,
  preload = false,
  loading = 'lazy',
  sizes,
  ...props
}) => {
  const imgRef = useRef(null)
  const shouldPrioritize = priority
  const [isLoaded, setIsLoaded] = useState(!transitionIn)
  const [isFullLoaded, setIsFullyLoaded] = useState(!transitionIn)

  const processed = processImageData({
    src, image, alt, width, height, ratio, quality,
    sizes, layout, priority, loading
  })

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete) {
      // already loaded (cache, fast network, etc.)
      setIsLoaded(true)
      setTimeout(() => {
        setIsFullyLoaded(true)
      }, 500)
    }
  }, [processed?.imgProps?.src])

  if (!processed) return null

  const { imgProps, hotspotX, hotspotY } = processed

  // Art direction: process mobile image if provided
  const mobileProcessed = mobileImage?.asset ? processImageData({
    image: mobileImage,
    alt: mobileImage?.alt || alt || image?.alt,
    ratio,
    quality,
    layout,
    sizes: sizes || '100vw',
    priority,
    loading,
  }) : null

  return (
    <div
      className={cx(className, 'component-image min-w-full', {
        'bg-(--image-bg)': !isFullLoaded && colorFill,
        'absolute top-0 left-0 w-full h-full': layout === 'cover' || layout === 'contain' || layout === 'fill',
      })}
      style={{
        '--image-bg': preloadColor || processed.paletteBg,
        '--ratio': processed.ratio,
        '--hotspot-x': hotspotX ? hotspotX * 100 + '%' : '50%',
        '--hotspot-y': hotspotY ? hotspotY * 100 + '%' : '50%'
      }}
    >
      <picture>
        {mobileProcessed && (
          <source
            media="(min-width: 768px)"
            srcSet={imgProps.srcSet}
            width={imgProps.width}
            height={imgProps.height}
          />
        )}
        <img
          ref={imgRef}
          {...(mobileProcessed ? mobileProcessed.imgProps : imgProps)}
          className={cx(
            imgClassName,
            'object-[var(--hotspot-x)_var(--hotspot-y)]',
            'min-w-full',
            {
              'transition': !shouldPrioritize,
              'absolute top-0 left-0 w-full h-full': layout === 'cover' || layout === 'contain' || layout === 'fill',
              'object-cover': layout === 'cover' || ratio,
              'object-contain': layout === 'contain',
              'object-fill': layout === 'fill',
              'opacity-0': !isLoaded,
              'aspect-(--ratio)': ratio
            }
          )}
          alt={imgProps.alt || ''}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      </picture>
    </div>
  )
}

export default Image
