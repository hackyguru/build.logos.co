import React from 'react'
import Section from '@components/Section'
import Media from '@components/Media'
import Container from '@components/Container'
import TextLockup from '@components/TextLockup'
import cx from 'classnames'
import ScrollEntrance from '@components/ScrollEntrance'

const hPlacementClass = {
	left: 'items-start',
	right: 'items-end',
	center: 'items-center'
}

const hPlacementGrid = {
	left: 'md:col-span-3',
	right: 'md:col-span-3 md:col-start-4',
	center: 'md:col-span-4 md:col-start-2'
}

const vPlacementClass = {
	top: 'justify-start',
	bottom: 'justify-end',
	middle: 'justify-center'
}

const heightSettings = {
	auto: '',
	fullHeight: 'calc(100 * var(--spacing-vh) - var(--spacing-header-height))',
	fullHeightAtf: 'calc(100 * var(--spacing-vh) - var(--spacing-header-banner-height) - var(--header-overlap))',
	mediumHeight: '75vh',
	shortHeight: '60vh'
}

const WideMedia = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	media = [],
	text,
	width,
	alignment,
	placement,
	overlayOpacity = 0,
	textColor,
	height,
	id,
	settings,
	...props
}) => {
	const mediaType = media[0]?._type

	const hPlacement = placement?.split('-')[0]
	const vPlacement = placement?.split('-')[1]

	let mediaAspect = 2

	if (height === 'fullHeight' && isFirstSection) {
		height = 'fullHeightAtf'
	}

	if (mediaType === 'image') {
		mediaAspect = media[0]?.aspectRatio
	}
	
	if (mediaType === 'video') {
		const videoAspectArray = media[0]?.videoFile?.asset?.data?.aspect_ratio.split(':')
		const videoAspect = parseInt(videoAspectArray[0]) / parseInt(videoAspectArray[1])
		mediaAspect = videoAspect
	}

	const fullWidth = width === 'fullWidth'

	let adjustmentForHeader = '0px'
	if (!settings?.headerOverlap) {
		adjustmentForHeader = 'var(--spacing-header-height-expanded)'
		if (theme && theme !== 'default') {
			adjustmentForHeader = 'calc(var(--spacing-header-height-expanded) + var(--spacing-margin))'
		}
	} else {
		if (!fullWidth) {
			adjustmentForHeader = 'var(--spacing-header-height-expanded)'
		}
	}

	let WrapperElement = 'div'
	if (!fullWidth) {
		WrapperElement = ScrollEntrance
	}

	let ContainerEl = Container
	if (fullWidth) {
		ContainerEl = 'div'
	}

	return (
		<Section
			className={cx('section-wide-media', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			isLastSection={isLastSection}
			paddedTop={!fullWidth}
			paddedBottom={!fullWidth}
			flushToTop={true}
			id={id}
			{...props}
		>
			<ContainerEl>
				<WrapperElement
					style={{
						'--aspect-ratio': mediaAspect,
						'--height-setting': heightSettings[height] || 'calc(100 * var(--spacing-vh))',
						'--header-overlap': adjustmentForHeader
					}}
					className={cx("relative", {
						// 'aspect-(--aspect-ratio)': height === 'auto',
						'min-h-(--height-setting)': height !== 'auto',
						'mt-header-height-expanded': isFirstSection && (!settings?.headerOverlap && fullWidth),
						'mt-margin': isFirstSection && (!settings?.headerOverlap && !fullWidth && theme !== 'default'),
						'theme-dark': textColor != 'dark',
						'theme-default': textColor == 'dark',
						'!bg-transparent': !fullWidth
					})}
				>
					<div className={cx('w-full z-1', {
						'absolute top-0 left-0 h-full': height !== 'auto',
						'relative': height === 'auto',
						'rounded overflow-hidden': !fullWidth
					})}>
						<Media
							media={media}
							layout={height !== 'auto' && 'cover'}
							className="z-1 w-full h-full"
							priority={isFirstSection}
							preload={isFirstSection}
						/>
						<div
							className="absolute top-0 left-0 w-full h-full bg-dark z-2"
							style={{ opacity: overlayOpacity / 100 }}
						/>
						{(isFirstSection && settings?.headerOverlap && fullWidth) && (
							<div className="absolute z-2 top-0 left-0 w-full h-[20%] min-h-[150px] bg-ease-to-b from-[rgba(0,0,0,.3)] to-transparent"/>
						)}
					</div>
					<div
						className={cx(
							"z-2 flex px-margin flex-col w-full h-full pb-margin",
							vPlacementClass[vPlacement],
							hPlacementClass[hPlacement],
							{
								'relative min-h-(--height-setting)': height !== 'auto',
								'absolute top-0 left-0': height === 'auto',
								'min-h-full': height === 'auto',
								'pt-header-height-expanded': settings?.headerOverlap && isFirstSection,
								'pt-margin': !settings?.headerOverlap || !isFirstSection
							}
						)}
					>
						<div className="w-full grid md:grid-cols-6 gap-gutter">
							<div className={cx(hPlacementGrid[hPlacement])}>
								<div className={cx('flex flex-col gap-8 text-balance', hPlacementClass[alignment])}>
									<TextLockup
										lockup={text}
										alignment={alignment}
										className={cx({
											'max-w-[800px]': alignment === 'center'
										})}
									/>
								</div>
							</div>
						</div>
					</div>
				</WrapperElement>
			</ContainerEl>
		</Section>
	)
}

export default WideMedia
