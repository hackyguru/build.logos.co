"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import cx from 'classnames'
import Image from '@components/Image'
import VideoControls from './VideoControls'

const MuxVideo = ({
  video,
  poster,
  ratio = 0,
  layout = 'responsive',
  autoplay = true,
  controls = 'none',
  muted = true,
  loop = true,
  className
}) => {

  const showControls = controls != 'none'

  const playbackId = video?.videoFile?.asset?.playbackId
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const hls = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoplay && showControls)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      setIsMobile(/android|iPad|iPhone|iPod/i.test(userAgent))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize HLS.js and load the Mux stream (dynamically imported)
  useEffect(() => {
    if (!playbackId) return

    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls.current = new Hls()
        hls.current.loadSource(`https://stream.mux.com/${playbackId}.m3u8`)
        hls.current.attachMedia(videoRef.current)

        hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          if (autoplay) {
            videoRef.current.muted = muted
            videoRef.current.play().catch((error) => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Autoplay failed:', error)
              }
              if (!muted) {
                videoRef.current.muted = true
                videoRef.current.play().catch(() => {})
              }
            })
          }
        })
      } else if (process.env.NODE_ENV === 'development') {
        console.error('HLS.js is not supported in this browser.')
      }
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load HLS.js:', error)
      }
    })

    return () => {
      if (hls.current) {
        hls.current.destroy()
      }
    }
  }, [playbackId, autoplay])

  const handlePlay = useCallback(() => {
    videoRef.current.play()
    setIsPlaying(true)

    if (isMobile && videoRef.current) {
      if (videoRef.current.webkitEnterFullscreen) {
        videoRef.current.webkitEnterFullscreen()
      } else if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }, [isMobile])

  const handlePause = useCallback(() => {
    videoRef.current.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }, [isPlaying, handlePause, handlePlay])

  const toggleFullscreen = useCallback(() => {
    if (!isMobile) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error attempting to enable fullscreen: ${err.message}`)
          }
        })
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [isMobile])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const newMuted = !isMuted
    videoRef.current.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

  // Track progress
  useEffect(() => {
    const vid = videoRef.current
    if (!vid || !showControls) return

    const onTimeUpdate = () => setProgress(vid.currentTime)
    const onLoadedMetadata = () => setDuration(vid.duration)

    vid.addEventListener('timeupdate', onTimeUpdate)
    vid.addEventListener('loadedmetadata', onLoadedMetadata)
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate)
      vid.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [showControls])

  const handleScrub = useCallback((newTime) => {
    setProgress(newTime)
    videoRef.current.currentTime = newTime
  }, [])

  if (!playbackId) {
		return null
	}

  const defaultPoster = `https://image.mux.com/${playbackId}/thumbnail.webp?width=${2000}&time=0&fit_mode=crop`

  const setRatio = true

  const assetAspectRadio = video?.videoFile?.asset?.data?.aspect_ratio?.split(':')
  const assetAspect = assetAspectRadio[0] / assetAspectRadio[1]

  return (
    <div
      style={{ '--ratio': ratio || assetAspect || 0 }}
      className={cx('w-full group/video', className, {
        'h-full': layout === 'cover' || layout === 'contain',
        'aspect-(--ratio) relative': setRatio
      })}
    >
      <div
        ref={containerRef}
        onClick={showControls ? togglePlay : undefined}
        onMouseEnter={showControls ? () => {} : undefined}
        onMouseLeave={showControls ? () => {} : undefined}
        className={cx('relative w-full', {
          'h-full': layout === 'cover' || layout === 'contain' || setRatio
        })}
      >
        {/* Poster Image */}
        {(!isPlaying || isLoading) && poster && (
          <div className="absolute inset-0 z-10">
            <Image
              src={poster}
              alt="Video poster"
              fill
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
        )}

        {/* Video Controls */}
        {showControls && (
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            isFullscreen={isFullscreen}
            progress={progress}
            duration={duration}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onToggleFullscreen={toggleFullscreen}
            onScrub={handleScrub}
          />
        )}

        <video
          loop={loop}
          playsInline
          poster={defaultPoster}
          muted={isMuted}
          className={cx('', {
            'absolute top-0 left-0 w-full h-full pointer-events-none': layout === 'cover' || layout === 'contain' || setRatio,
            'object-cover bg-black': layout === 'cover' || setRatio,
            'object-contain!': layout === 'contain',
            'col-span-12 w-full h-auto': !layout || layout === 'responsive',
          })}
          ref={videoRef}
        />
        {layout}
      </div>
    </div>
  )
}

export default MuxVideo
