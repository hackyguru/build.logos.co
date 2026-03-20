'use client'

import React, { lazy, Suspense } from 'react'
import Image from '@components/Image'
import cx from 'classnames'

// Lazy load Video component to avoid loading HLS.js on every page
const Video = lazy(() => import('@components/Video'))

const Media = ({
	className,
	media,
	layout,
	ratio,
	index = 0,
	sizes,
	priority,
	preload = false,
	isFirstSection = false,
}) => {
	const itemToShow = index
	const mediaItems = media?.filter(item => item._type === 'image' || item._type === 'video')
	const mediaItemsMobile = media?.filter(item => item._type.includes('mobile'))

	const desktopItem = mediaItems?.[itemToShow]
	const mobileItem = mediaItemsMobile?.[itemToShow]

	const hasMobileVariant = !!mobileItem
	const bothAreImages = desktopItem?._type === 'image' && mobileItem?._type === 'mobilePhoto'

	// Art-directed <picture>: pass mobileImage to Image, single download
	if (bothAreImages) {
		return (
			<Image
				alt={desktopItem?.alt}
				ratio={ratio}
				className={className}
				image={desktopItem}
				mobileImage={mobileItem}
				layout={layout}
				sizes={sizes}
				preload={preload}
				priority={priority}
			/>
		)
	}

	// Fallback: CSS show/hide for mixed media types (image + video, etc.)
	return (
		<div className={cx(className)}>
			{mediaItems?.map((item, index) => {
				if (index !== itemToShow) {
					return null
				}

				if (item._type === 'image') {
					return (
						<Image
							alt={item?.alt}
							ratio={ratio}
							className={cx(className, {
								'hidden md:block': hasMobileVariant
							})}
							key={item._key}
							image={item}
							layout={layout}
							sizes={sizes}
							preload={preload}
							priority={priority}
						/>
					)
				}
				if (item._type === 'video') {
					return (
						<Suspense key={item._key} fallback={<div className={cx(className, 'aspect-video bg-gray-100', {
							'hidden md:block': hasMobileVariant
						})} />}>
							<Video
								ratio={ratio}
								className={cx(className, {
									'hidden md:block': hasMobileVariant
								})}
								video={item}
								layout={layout}
							/>
						</Suspense>
					)
				}
			})}

			{mediaItemsMobile?.map((item, index) => {
				if (index !== itemToShow) {
					return null
				}

				if (item._type === 'mobilePhoto') {
					return (
						<Image
							alt={item?.alt}
							ratio={ratio}
							className={cx(className, "md:hidden")}
							key={item._key}
							image={item}
							layout={layout}
							sizes={sizes}
							priority={priority}
						/>
					)
				}
				if (item._type === 'mobileVideo') {
					return (
						<Suspense key={item._key} fallback={<div className={cx(className, 'aspect-video bg-gray-100 md:hidden')} />}>
							<Video
								ratio={ratio}
								className={cx(className, "md:hidden")}
								video={item}
								layout={layout}
							/>
						</Suspense>
					)
				}
			})}
		</div>
	)
}

export default Media
