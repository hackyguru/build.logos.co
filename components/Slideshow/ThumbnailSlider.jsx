import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import VideoThumbnail from '@components/VideoThumbnail'
import cx from 'classnames'

const Slideshow = ({
	className = '',
	autoplay = false,
	slideGap,
  currentSlide,
  goToSlide,
  loop = false,
	autoplaySpeed = 4000,
	slides = []
}) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'start',
    loop: loop,
		containScroll: 'trimSnaps'
	}, [ClassNames()])

  useEffect(() => {
    emblaApi?.scrollTo(currentSlide)
  }, [currentSlide, emblaApi])

	if (slides.length < 1) {
		return false
	}

	if (slides.length < 2) {
		return children
	}

	return (
		<div
			ref={emblaRef}
			style={{
				'--progress': currentSlide,
				'--slide-count': slides.length,
				'--slide-gap': slideGap || '8px',
				'--slides-xs': slides.length > 3 ? 3.5 : slides.length,
				'--slides-sm': slides.length > 4 ? 4.5 : slides.length,
				'--slides-md': slides.length > 6 ? 6.5 : slides.length,
				'--slides-lg': slides.length > 8 ? 8.5 : slides.length,
				'--slides-xl': slides.length > 9 ? 9.5 : slides.length,
				'--slides-2xl': slides.length > 10 ? 10.5 : slides.length,
			}}
			className={cx(className, 'slider overflow-visible max-w-full', {
				'loop': loop
			})}
		>
			<div className="slider-container">
				{slides.map((slide, index) => {
					const slideObject = slide?.props?.children?.props
					const slideContent = slideObject?.children?.props
					if (slideObject?.className?.includes('media-video')) {
						slide = <VideoThumbnail video={slideContent?.media?.video} />
					}
					return (
						<div
              onClick={() => {
								if (currentSlide !== index) {
									goToSlide(index)
								}
							}}
							data-index={index}
							key={'slide-' + index}
              className={cx("group slider-slide auto-width max-w-[120px] relative", {
								'mb-[4px]': !autoplay,
								'cursor-pointer': currentSlide !== index
							})}
            >
							<div className="relative aspect-video z-1 pointer-events-none overflow-hidden">
								{slide}
                {currentSlide !== index && (
                  <div className="group-hover:opacity-100 transition-opacity opacity-0 absolute top-0 left-0 w-full h-full border-[rgba(255,255,255,.5)]"></div>
                )}
              </div>
							{autoplay ? (
								<div
									className={cx(
										'bg-ease-to-t from-[rgba(0,0,0,.4)] to-[rgba(0,0,0,0)]',
										'z-2 p-2 absolute bottom-0 left-0 w-full pointer-events-none',
										'transition-opacity',
										{
											'opacity-0 group-hover:opacity-20': currentSlide !== index
										}
									)}
								>
									<div className='h-[2px] bg-[rgba(255,255,255,.3)]'>
										<div
											style={{ '--speed': autoplaySpeed + 'ms' }}
											className={cx('slide-progress h-full bg-white', {
												'animating': currentSlide === index,
												'ended': currentSlide !== index
											})}
										/>
									</div>
								</div>
							) : (
								<div
									// className={`${'h-full bg-white transition-opacity ' + (currentSlide === index ? '' : 'opacity-0')}`}
									className={cx('z-2 pointer-events-none transition absolute border-2 -top-[4px] -left-[4px] -right-[4px] -bottom-[4px]', {
										'': currentSlide === index,
										'opacity-0 group-hover:opacity-20': currentSlide !== index
									})}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Slideshow
