"use client"

import React, { useEffect, useState } from 'react'
import { useWindowSize } from "@uidotdev/usehooks"
import { isBrowser, isMobileSafari } from '@utils/helpers'

const OnMount = () => {
  // set window height var (w/ safari/iOS hack)
  const { height: windowHeight, width: windowWidth } = useWindowSize()
  const [lockHeight, setLockHeight] = useState(false)
  const [jsClassName, setJsClassName] = useState('no-js')
  const hasChin = isMobileSafari()

	useEffect(() => {
    if (windowHeight > 0) {
      if ((isBrowser && !lockHeight) || !hasChin) {
        document?.body?.style.setProperty('--spacing-vh', `${windowHeight * 0.01}px`)
        setLockHeight(hasChin)
      }
    }
    if (windowWidth > 0) {
      if (isBrowser) {
        const clientWidth = document.documentElement.clientWidth
        document?.body?.style.setProperty('--spacing-vw', `${clientWidth * 0.01}px`)
      }
    }
  }, [windowHeight, windowWidth, hasChin, lockHeight])

  useEffect(() => {
    setJsClassName('')
  }, [])

	return (
		<span className={'hidden ' + jsClassName}></span>
	)
}

export default OnMount
