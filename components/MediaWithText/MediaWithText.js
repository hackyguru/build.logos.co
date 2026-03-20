import React from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import Media from '@components/Media'
import RichText from '@components/RichText'
import TextLockup from '@components/TextLockup'
import ScrollEntrance from '@components/ScrollEntrance'
import cx from 'classnames'
import { buildSizesString } from '@utils/helpers'
import Slideshow from '@components/Slideshow'

// Media columns for different size settings
const gridSetup = {
	small: 5,
	medium: 6,
	large: 7
}

const mediaSizes = {
	small: (100 / 12) * gridSetup.small + 'vw',
	medium: (100 / 12) * gridSetup.medium + 'vw',
	large: (100 / 12) * gridSetup.large + 'vw'
}

const MediaWithText = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	media = [],
	mediaBleed,
	text,
	sectionSettings = {},
	mediaAspect,
	id,
	...props
}) => {
	const s = sectionSettings

	const largeMedia = s.mediaSize === 'large'

	let cardThemeClass = false
	if (s.layout === 'card') {
		cardThemeClass = 'theme-' + s.cardTheme
	}

	return (
		<Section
			className={cx('section-media-with-text', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			id={id}
			style={{ contain: 'paint' }}
			{...props}
		>
			<Container>
				<div
					className={cx("grid md:grid-cols-12 gap-x-gutter gap-y-v-space-sm", cardThemeClass, {
					'items-center': s.vAlignment === 'center',
					'items-end': s.vAlignment === 'bottom',
					'p-gutter rounded-[21vw] md:rounded-[13vw] pb-v-space-sm md:pb-gutter': s.layout === 'card'
				})}>
					<ScrollEntrance
						style={{
							'--col-span': gridSetup[s.mediaSize]
						}}
						className={cx(
							'md:col-span-(--col-span)',
							{
								'md:order-2': s.mediaPosition === 'right',
								'md:order-1': s.mediaPosition === 'left',
								'order-2': s.mediaPositionMobile === 'bottom'
							}
						)}
					>
						<div className={cx('h-full', {
							"md:grid md:grid-cols-6 gap-gutter": s.mediaSize === 'small' && !s.mediaBleed,
							'-mx-margin': s.mediaBleed,
							'md:ml-0 -mr-margin md:mr-[min(calc(((var(--spacing-vw)*100)-var(--spacing-site-max-width))/-2),calc(var(--margin)*-1))]': s.mediaBleed && s.mediaPosition === 'right',
							'md:mr-0 -ml-margin md:ml-[min(calc(((var(--spacing-vw)*100)-var(--spacing-site-max-width))/-2),calc(var(--margin)*-1))]': s.mediaBleed && s.mediaPosition === 'left'
						})}>
							<div
								style={{ '--media-aspect': mediaAspect }}
								className={cx({
									'col-span-full lg:col-span-full': s.mediaSize === 'small' && !s.mediaBleed,
									'md:sticky md:top-sticky-top transition-top': s.vAlignment === 'sticky',
								})}
							>
								{media?.length > 1 ? (
									<div className='relative w-full'>
										<Slideshow
											className='group/slideshow'
											slideGap='0px'
											loop
											arrowsClassname={cx('absolute top-0 left-0 w-full aspect-(--media-aspect) justify-between p-gutter opacity-0 group-hover/slideshow:opacity-100 transition-opacity', {
												'rounded': media.length > 1
											})}
										>
											{media.map((m, index) => {
												return (
													<div key={media[index]?._key}>
														<Media
															priority={isFirstSection}
															media={media}
															index={index}
															ratio={mediaAspect > 0 ? mediaAspect : false}
															className={cx('overflow-hidden', {
																'rounded-l': s.mediaBleed && s.mediaPosition === 'right',
																'rounded-r': s.mediaBleed && s.mediaPosition === 'left',
																'rounded': !s.mediaBleed && media.length < 2
															})}
															sizes={buildSizesString({
																md: mediaSizes[s.mediaSize],
																mobile: s.mediaBleed ? '100vw' : '98vw'
															})}
														/>
														<RichText
															className={cx('body-small pt-2 text-balance', {
																'pl-margin': s.mediaBleed,
																'md:pl-gutter': s.mediaBleed && s.mediaPosition === 'left',
																'md:pl-0': s.mediaBleed && s.mediaPosition === 'right',
															})}
															text={media[index]?.caption}
														/>
													</div>
												)
											})}
										</Slideshow>
									</div>
								) : (
									<div className='w-full'>
										<Media
											priority={isFirstSection}
											media={media}
											ratio={mediaAspect > 0 ? mediaAspect : false}
											className={cx('overflow-hidden', {
												'rounded': !s.mediaBleed,
												'md:rounded-l': s.mediaBleed && s.mediaPosition === 'right',
												'md:rounded-r': s.mediaBleed && s.mediaPosition === 'left',
												'rounded-[calc(21vw-var(--spacing-gutter))] md:rounded-[calc(13vw-var(--spacing-gutter))]': s.layout === 'card'
											})}
											sizes={buildSizesString({
												md: mediaSizes[s.mediaSize],
												mobile: s.mediaBleed ? '100vw' : '98vw'
											})}
										/>
										<RichText
											className={cx('body-small pt-2 text-balance', {
												'pl-margin': s.mediaBleed,
												'md:pl-gutter': s.mediaBleed && s.mediaPosition === 'left',
												'md:pl-0': s.mediaBleed && s.mediaPosition === 'right',
											})}
											text={media[0]?.caption}
										/>
									</div>
								)}
							</div>
						</div>
					</ScrollEntrance>
					<div
						style={{
							'--col-span': 12 - gridSetup[s.mediaSize],
							'--grid-cols': 'repeat(var(--col-span), minmax(0, 1fr))'
						}}
						className={cx(
							'md:col-span-(--col-span)',
							'md:grid md:grid-cols-(--grid-cols) md:gap-gutter',
							{
								'md:px-v-space-sm': s.textAlignment === 'center',
								'md:order-1': s.mediaPosition === 'right',
								'md:order-2': s.mediaPosition === 'left',
								'order-1': s.mediaPositionMobile === 'bottom'
							}
						)}
					>
						<div className={cx('h-full', {
							'md:col-start-2 md:col-span-[calc(var(--col-span)-2)]': !largeMedia,
							'md:col-span-full lg:col-start-2 lg:col-span-[calc(var(--col-span)-2)]': largeMedia
						})}>
							<TextLockup
								lockup={text}
								alignment={s.textAlignment || 'left'}
								alignmentMobile={s.textAlignmentMobile || s.textAlignment || 'left'}
								vAlignment={s.vAlignment}
								className={cx('sm:text-balance md:max-w-[550px]', {
									'md:sticky md:top-sticky-top transition-[top]': s.vAlignment === 'sticky',
								})}
							/>
						</div>
					</div>
				</div>
			</Container>
		</Section>
	)
}

export default MediaWithText
