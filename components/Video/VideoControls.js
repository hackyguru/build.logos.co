"use client"

import React, { useRef } from 'react'
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from 'react-icons/md'
import { CgMinimize, CgMaximize } from 'react-icons/cg'

const VideoControls = ({
  isPlaying,
  isMuted,
  isFullscreen,
  progress,
  duration,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onScrub
}) => {
  const scrubberRef = useRef(null)

  const handleScrub = (e) => {
    const rect = scrubberRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const pct = x / rect.width
    onScrub(pct * duration)
  }

  const handleScrubStart = (e) => {
    e.stopPropagation()
    handleScrub(e)

    const onMove = (e) => handleScrub(e)
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div className="pointer-events-none bg-ease-to-t from-black/30 pt-10 opacity-0 group-hover/video:opacity-100 transition-opacity video-controls absolute bottom-0 left-0 w-full z-30" onClick={(e) => e.stopPropagation()}>
      {/* Buttons */}
      <div className="flex items-center gap-3 text-white px-3 py-2">
        <button
          className="pointer-events-auto flex cursor-pointer hover:opacity-75 transition-opacity"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <MdPause size={20} />
          ) : (
            <MdPlayArrow size={20} />
          )}
        </button>

        <button
          className="pointer-events-auto flex cursor-pointer hover:opacity-75 transition-opacity"
          onClick={onToggleMute}
        >
          {isMuted ? (
            <MdVolumeOff size={20} />
          ) : (
            <MdVolumeUp size={20} />
          )}
        </button>

        <div className="grow" />

        <button
          className="pointer-events-auto flex items-center cursor-pointer hover:opacity-75 transition-opacity"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <CgMinimize size={20} />
          ) : (
            <CgMaximize size={20} />
          )}
        </button>
      </div>
      {/* Progress Scrubber */}
      <div
        ref={scrubberRef}
        className="pointer-events-auto video-scrubber group/scrubber relative w-full h-[5px] flex items-end cursor-pointer"
        onMouseDown={handleScrubStart}
      >
        <div className="video-scrubber-track relative w-full h-[3px] group-hover/scrubber:h-[5px] transition-[height] bg-white/30">
          <div
            className="video-scrubber-fill absolute top-0 left-0 h-full bg-white transition-[background]"
            style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoControls
