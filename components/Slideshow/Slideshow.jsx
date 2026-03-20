"use client"

import React, {
	Children,
	useEffect,
	useState,
	useCallback,
	forwardRef,
	useImperativeHandle,
	useMemo
} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import ClassNames from 'embla-carousel-class-names'
import { debounce } from '@utils/helpers'
import cx from 'classnames'
import SlideshowArrows from './SlideshowArrows'

const arrowPositions = {
	center: { wrapper: 'justify-between items-center', prev: '', next: '' },
	bottom: { wrapper: 'justify-between items-end', prev: '', next: '' },
	'bottom-right': { wrapper: 'justify-end items-end', prev: '', next: '' }
}

const Slideshow = forwardRef(({
	className = '',
	loop = false,
	autoplay = false,
	fade = false,
	arrows = true,
	arrowsClassname,
	arrowsHideDisabled = false,
	slideGap,
	children = [],
	slideClassname = '',
	containerClassname,
	autoplaySpeed = 4000,
	speed = 25,
	slidesAutoWidth = false,
	slidesToScroll = 1,
	align,
	slidesXs = 1,
	slidesSm = 1,
	slidesMd = 1,
	slidesLg = 1,
	slidesXl = 1,
	slides2xl = 1,
	startIndex = 0,
	getCanScroll = () => {},
	onSlideChange,
	axis: axisProp = 'x',
	breakpoints = {},
	readOnly = false,
	style
}, ref) => {
	const slides = Children.toArray(children)

	const [currentSlide, setCurrentSlide] = useState(0)
	const [canScrollNext, setCanScrollNext] = useState(true)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [isScrollable, setIsScrollable] = useState(true)
	const [isActive, setIsActive] = useState(true)
	const [currentAxis, setCurrentAxis] = useState(() => {
		if (typeof axisProp === 'string') return axisProp
		return axisProp.default || 'x'
	})

	const autoplayOptions = {
		stopOnInteraction: false,
		delay: autoplaySpeed
	}

	let plugins = [ClassNames()]
	if (autoplay) plugins = [Autoplay(autoplayOptions), ClassNames()]
	if (fade) plugins = [Fade(), ClassNames()]
	if (autoplay && fade) plugins = [Autoplay(autoplayOptions), Fade(), ClassNames()]

	const emblaOptions = useMemo(() => ({
		align: align || 'start',
		containScroll: 'trimSnaps',
		axis: currentAxis,
		loop,
		slidesToScroll,
		duration: speed,
		startIndex: startIndex || 0,
		breakpoints,
		watchDrag: readOnly ? false : isScrollable
	}), [align, currentAxis, loop, slidesToScroll, speed, breakpoints, isScrollable, readOnly])

	const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins)

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
	const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi])
	
	useImperativeHandle(ref, () => ({
		scrollPrev,
		scrollNext,
		scrollTo,
		getCurrentSlide: () => currentSlide,
		getApi: () => emblaApi,
		getCanScrollPrev: () => emblaApi?.canScrollPrev?.() ?? false,
		getCanScrollNext: () => emblaApi?.canScrollNext?.() ?? false,
		getIsActive: () => isActive,
		getAxis: () => currentAxis,
	}), [
		scrollPrev,
		scrollNext,
		scrollTo,
		emblaApi,
		currentSlide,
		isActive,
		currentAxis
	])

	const debouncedGetCanScroll = useCallback(
		debounce((scrollInfo) => getCanScroll(scrollInfo), 100),
		[getCanScroll]
	)

	const updateCurrentSlide = useCallback((emblaApi) => {
		const newSlide = emblaApi.selectedScrollSnap()
		setCanScrollNext(emblaApi.canScrollNext())
		setCanScrollPrev(emblaApi.canScrollPrev())
		setCurrentSlide(newSlide)
		setIsScrollable(emblaApi.scrollSnapList().length > 1)
		onSlideChange?.(newSlide)
		debouncedGetCanScroll({
			prev: emblaApi.canScrollPrev(),
			next: emblaApi.canScrollNext()
		})
	}, [getCanScroll, onSlideChange])

	useEffect(() => {
		if (!emblaApi) return

		const onSelect = () => {
			requestAnimationFrame(() => updateCurrentSlide(emblaApi))
		}

		const onResize = () => {
			requestAnimationFrame(() => {
				const scrollable = emblaApi.scrollSnapList().length > 1
				setIsScrollable(scrollable)
			})
		}

		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onResize)
		onSelect()

		return () => {
			emblaApi.off('select', onSelect)
			emblaApi.off('reInit', onResize)
		}

	}, [emblaApi, updateCurrentSlide])

	// Track axis from breakpoints using matchMedia
	useEffect(() => {
		if (typeof axisProp === 'string') {
			setCurrentAxis(axisProp)
			return
		}

		const entries = Object.entries(axisProp).filter(([key]) => key !== 'default')
		if (entries.length === 0) {
			setCurrentAxis(axisProp.default || 'x')
			return
		}

		const mediaQueryLists = entries.map(([query, value]) => ({
			mql: window.matchMedia(query),
			value
		}))

		const checkAxis = () => {
			let resolved = axisProp.default || 'x'
			for (const { mql, value } of mediaQueryLists) {
				if (mql.matches) {
					resolved = value
				}
			}
			setCurrentAxis(resolved)
		}

		checkAxis()
		mediaQueryLists.forEach(({ mql }) => mql.addEventListener('change', checkAxis))
		return () => {
			mediaQueryLists.forEach(({ mql }) => mql.removeEventListener('change', checkAxis))
		}
	}, [axisProp])

	// Reinit embla when axis changes
	useEffect(() => {
		if (!emblaApi) return
		emblaApi.reInit({ axis: currentAxis })
	}, [emblaApi, currentAxis])

	// Track active state from breakpoints using matchMedia
	useEffect(() => {
		const inactiveQueries = Object.entries(breakpoints)
			.filter(([, opts]) => opts.active === false)
			.map(([query]) => query)

		if (inactiveQueries.length === 0) {
			setIsActive(true)
			return
		}

		const mediaQueryLists = inactiveQueries.map(q => window.matchMedia(q))

		const checkActive = () => {
			const shouldBeInactive = mediaQueryLists.some(mq => mq.matches)
			setIsActive(!shouldBeInactive)
		}

		checkActive()
		mediaQueryLists.forEach(mq => mq.addEventListener('change', checkActive))

		return () => {
			mediaQueryLists.forEach(mq => mq.removeEventListener('change', checkActive))
		}
	}, [breakpoints])

	// Reinit embla when isScrollable changes to update watchDrag
	useEffect(() => {
		if (!emblaApi) return
		emblaApi.reInit({ watchDrag: readOnly ? false : isScrollable })
	}, [emblaApi, isScrollable, readOnly])

	// Keyboard navigation
	const handleKeyDown = useCallback((e) => {
		if (!emblaApi || readOnly) return

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault()
				emblaApi.scrollPrev()
				break
			case 'ArrowRight':
				e.preventDefault()
				emblaApi.scrollNext()
				break
			case 'Home':
				e.preventDefault()
				emblaApi.scrollTo(0)
				break
			case 'End':
				e.preventDefault()
				emblaApi.scrollTo(slides.length - 1)
				break
		}
	}, [emblaApi, slides.length])

	if (slides.length < 1) return null
	if (slides.length < 2) return (
		<div
			className={cx('slider-single-item', className)}
			style={{
				...style,
				'--progress': currentSlide,
				'--slide-count': slides.length,
				'--slide-gap': slideGap || 'var(--spacing-gutter)',
				'--slides-xs': slidesXs,
				'--slides-sm': slidesSm,
				'--slides-md': slidesMd,
				'--slides-lg': slidesLg,
				'--slides-xl': slidesXl,
				'--slides-2xl': slides2xl
			}}
		>{children}</div>
	)

	return (
		<div
			className={cx(
				className,
				'slider relative group/slider',
				{ 'loop': loop, 'center-aligned': align === 'center', 'axis-y': currentAxis === 'y' }
			)}
			data-active={isActive}
			ref={emblaRef}
			tabIndex={0}
			role="region"
			aria-roledescription="carousel"
			aria-label={`Slideshow with ${slides.length} slides`}
			onKeyDown={handleKeyDown}
			style={{
				...style,
				'--progress': currentSlide,
				'--slide-count': slides.length,
				'--slide-gap': slideGap || 'var(--spacing-gutter)',
				'--slides-xs': slidesXs,
				'--slides-sm': slidesSm,
				'--slides-md': slidesMd,
				'--slides-lg': slidesLg,
				'--slides-xl': slidesXl,
				'--slides-2xl': slides2xl
			}}
		>
			<div className={cx(containerClassname, "slider-container")}>
				{slides.map((slide, index) => (
					<div
						key={`slide-${index}`}
						className={`slider-slide overflow-hidden ${slidesAutoWidth ? 'auto-width' : ''} ${slideClassname}`}
						role="group"
						aria-roledescription="slide"
						aria-label={`Slide ${index + 1} of ${slides.length}`}
					>
						{slide}
					</div>
				))}
			</div>
			{arrows && isActive && (
				<SlideshowArrows
					slideshowApi={emblaApi}
					slides={slides}
					className={arrowsClassname || 'absolute top-0 left-0 z-2 w-full h-full p-gutter justify-between'}
					hideDisabled={arrowsHideDisabled}
				/>
			)}
		</div>
	)
})

export default Slideshow