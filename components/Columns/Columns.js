"use client"

import React, { useRef } from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import ScrollEntrance from '@components/ScrollEntrance'
import RichText from '@components/RichText'
import Actions from '@components/Actions'
import Media from '@components/Media'
import Slideshow from '@components/Slideshow'
import SlideshowArrows from '@components/Slideshow/SlideshowArrows'
import cx from 'classnames'
import { buildSizesString } from '@utils/helpers'

const ColumnItem = ({ item, mediaRatio, isFirstSection }) => {
	const style = item.style
	const isCard = style === 'card' || style === 'rounded-card'
	const mediaBackground = isCard && item.media
	const alignment = isCard ? 'center' : 'left'
	return (
		<div>
			<div className={cx('space-y-gutter', {
				'aspect-[7/5] flex relative items-center justify-center text-center': isCard,
				'border': !mediaBackground,
				'theme-dark overflow-hidden': mediaBackground,
				'rounded-[21vw] md:rounded-[13vw]': style === 'rounded-card'
			})}>
				{item.media && (
					<div 
						className={cx('relative', {
							'absolute! top-0 left-0 w-full h-full z-1 m-0': isCard,
							'blur-[40px]': mediaBackground
						})}
					>
						<Media
							priority={isFirstSection}
							media={item.media}
							ratio={mediaRatio}
							className='z-1'
							layout={isCard && 'cover'}
							sizes={buildSizesString({
								md: '800px',
								mobile: '98vw'
							})}
						/>
					</div>
				)}
				<div className={cx("space-y-gutter", {
					'relative z-2 text-center': isCard
				})}>
					<div className={cx("flex items-center justify-start gap-3", {
						'mt-4': item?.media,
						'text-center justify-center!': alignment === 'center'
					})}>
						<h3 className='h5 sans'>
							{item.title}
						</h3>
					</div>
					{item.text && (
						<div className='body-tiny'>
							<RichText text={item.text} alignment={alignment} className='max-w-[32em] text-balance' />
						</div>
					)}
					<Actions actions={item.actions} className='pt-2' alignment={alignment} />
				</div>
			</div>
		</div>
	)
}

const Columns = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	items,
	mediaRatio,
	carousel,
	columnsDesktop = 3,
	columnsTablet = 3,
	columnsMobile = 1,
	carouselLoop = false,
	id,
	...props
}) => {
	const slideshowRef = useRef(null)

	if (!items || items?.length < 1) {
		return false
	}

	return (
		<Section
			className={'overflow-hidden'}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			isLastSection={isLastSection}
			id={id}
			{...props}
		>
			<Container>
				{carousel !== 'desktop-mobile' && (
					<ScrollEntrance
						style={{
							'--cols-mobile': `repeat(${columnsMobile}, minmax(0, 1fr))`,
							'--cols-tablet': `repeat(${columnsTablet}, minmax(0, 1fr))`,
							'--cols-desktop': `repeat(${columnsDesktop}, minmax(0, 1fr))`
						}}
						className={cx(
							'grid gap-x-gutter gap-y-v-space-sm',
							'grid-cols-(--cols-mobile)',
							'md:grid-cols-(--cols-tablet)',
							'lg:grid-cols-(--cols-desktop)',
							{
								'md:hidden': carousel === 'desktop',
								'hidden md:grid': carousel === 'mobile'
							}
						)}
					>
						{items.map((item, index) => {
							return (
								<ColumnItem
									isFirstSection={isFirstSection}
									item={item}
									mediaRatio={mediaRatio}
									key={item._key + index}
								/>
							)
						})}
					</ScrollEntrance>
				)}
				
				{carousel !== 'none' && (
					<>
						<ScrollEntrance
							className={cx({
								'hidden md:block': carousel === 'desktop',
								'md:hidden': carousel === 'mobile'
							})}
						>
							<Slideshow
								ref={slideshowRef}
								className='overflow-visible'
								loop={carouselLoop}
								slidesXs={columnsMobile}
								slidesSm={columnsTablet}
								slidesMd={columnsTablet}
								slidesLg={columnsDesktop}
								slidesXl={columnsDesktop}
								slides2xl={columnsDesktop}
								duplicatedDots={items.length < columnsDesktop * 2}
								align={'start'}
								pager={false}
								arrows={false}
							>
								{items.map((item, index) => {
									return (
										<ColumnItem
											isFirstSection={isFirstSection}
											item={item}
											mediaRatio={mediaRatio}
											key={item._key + index}
										/>
									)
								})}
								{(carouselLoop && items.length < columnsDesktop + 1) && (
									items.map((item, index) => {
										return (
											<ColumnItem
												isFirstSection={isFirstSection}
												item={item}
												mediaRatio={mediaRatio}
												key={item._key + index + '-duplicates'}
											/>
										)
									})
								)}
							</Slideshow>
						</ScrollEntrance>

						<div className={cx({
							'hidden md:flex': carousel === 'desktop',
							'md:hidden': carousel === 'mobile'
						})}>
							<SlideshowArrows
								slides={items}
								className='pt-v-space-sm justify-center w-full'
								slideshow={slideshowRef}
							/>
						</div>
					</>
				)}
			</Container>
		</Section>
	)
}

export default Columns
