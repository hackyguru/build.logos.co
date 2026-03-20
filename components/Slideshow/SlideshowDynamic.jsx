"use client"

import dynamic from 'next/dynamic'
import { forwardRef } from 'react'

// Lazy load Embla carousel by default - automatically optimizes all usages
const SlideshowDynamic = dynamic(() => import('./Slideshow'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] animate-pulse bg-light-grey" />
})

// Forward ref wrapper to maintain component API
const Slideshow = forwardRef((props, ref) => {
  return <SlideshowDynamic {...props} ref={ref} />
})

Slideshow.displayName = 'Slideshow'

export default Slideshow
