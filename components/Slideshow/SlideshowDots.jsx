"use client"

import React, { useState, useEffect } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'
import cx from 'classnames'

const SlideshowArrows = ({
  slideshow,
  slideshowApi,
  slides = [],
  className,
  buttonClass = 'circle small',
  prevButtonClass,
  nextButtonClass,
  hideDisiabled = false
}) => {
  const { width: windowWidth } = useWindowSize()

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrollable, setIsScrollable] = useState(true)

  const slideshowEl = slideshowApi || slideshow?.current

  if (!slides) {
    if (process.env.NODE_ENV === 'development') {
      console.error('SlideshowDots: Missing required `slides` prop')
    }
    return null
  }

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
    <div className={cx(className, "flex items-center -mx-3")}>
      {slides.map((s, index) => {
        return (
          <button
            key={'pager-slide-' + index}
            onClick={() => slideshowEl?.scrollTo?.(index)}
            className='flex p-3 group'
            title={'Go to slide' + (index + 1)}
          >
            <div className={cx("rounded-full transition-[background] w-[8px] h-[8px] pointer-events-none", {
              'bg-success': currentSlide === index,
              'bg-mid-grey group-hover:bg-green': currentSlide !== index
            })} />
          </button>
        )
      })}
    </div>
  )
}

export default SlideshowArrows