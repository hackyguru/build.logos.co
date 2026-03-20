"use client"

import React, { useState, useEffect } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'
import Arrow from '@components/Arrow'
import Button from '@components/Button'
import SlideshowCounter from './SlideshowCounter'
import cx from 'classnames'

const SlideshowArrows = ({
  slideshow,
  slideshowApi,
  slides = [],
  className,
  buttonClass = 'square small transparent',
  prevButtonClass,
  nextButtonClass,
  hideDisabled = false
}) => {
  const { width: windowWidth } = useWindowSize()

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrollable, setIsScrollable] = useState(true)

  const slideshowEl = slideshowApi || slideshow?.current

  // Determine scrollability and current state
  useEffect(() => {
    let rafId
  
    const waitForEmbla = () => {
      const api = slideshowApi || slideshow?.current?.getApi?.()
      if (!api) {
        rafId = requestAnimationFrame(waitForEmbla)
        return
      }
  
      const update = () => {
        setCanScrollNext(api.canScrollNext())
        setCanScrollPrev(api.canScrollPrev())
        setCurrentSlide(api.selectedScrollSnap())
        setIsScrollable(api.scrollSnapList().length > 1)
      }
  
      update()
      api.on('select', () => requestAnimationFrame(update))
      api.on('reInit', () => requestAnimationFrame(update))
  
      // Clean up
      return () => {
        api.off('select', update)
        api.off('reInit', update)
        cancelAnimationFrame(rafId)
      }
    }
  
    rafId = requestAnimationFrame(waitForEmbla)
  
    return () => cancelAnimationFrame(rafId)
  }, [slideshow, slideshowApi, windowWidth])

  if (!isScrollable) return null

  return (
    <div className={cx(className, "flex items-center gap-4 pointer-events-none")}>
      <Button
        as='button'
        onClick={() => slideshowEl?.scrollPrev?.()}
        className={cx('pointer-events-auto', buttonClass, prevButtonClass, {
          '!opacity-0': !canScrollPrev && hideDisabled
        })}
        disabled={!canScrollPrev}
        title="Previous slide"
        aria-label={`Previous slide (${currentSlide} of ${slides.length})`}
        icon={<Arrow direction="left" aria-hidden="true" width="var(--button-height)" />}
      />
      <Button
        as='button'
        onClick={() => slideshowEl?.scrollNext?.()}
        className={cx('pointer-events-auto', buttonClass, nextButtonClass, {
          '!opacity-0': !canScrollNext && hideDisabled
        })}
        disabled={!canScrollNext}
        title="Next slide"
        aria-label={`Next slide (${currentSlide + 2} of ${slides.length})`}
        icon={<Arrow direction="right" aria-hidden="true" width="var(--button-height)" />}
      />
    </div>
  )
}

export default SlideshowArrows