"use client"

import { useEffect, useRef } from 'react'

/**
 * LiveRegion - Announces messages to screen readers via ARIA live regions
 *
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' (wait for pause) or 'assertive' (interrupt)
 * @param {boolean} atomic - Whether to announce the entire region (true) or just changes (false)
 */
const LiveRegion = ({
  message = '',
  politeness = 'polite',
  atomic = true
}) => {
  const previousMessage = useRef('')

  useEffect(() => {
    // Only announce if message has actually changed
    if (message && message !== previousMessage.current) {
      previousMessage.current = message
    }
  }, [message])

  // Don't render anything visible
  if (!message) return null

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {message}
    </div>
  )
}

export default LiveRegion
