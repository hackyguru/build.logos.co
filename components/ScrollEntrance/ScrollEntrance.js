"use client"

import React, { useRef, useEffect, useState } from 'react'
import cx from 'classnames'

const ScrollEntrance = ({
	className = '',
	children,
	transitionIn = true,
	delay = 0,
	transform = undefined,
	as = 'div',
	style = {}
}) => {
	const [inView, setInView] = useState(false)
	const ref = useRef(null)
	const Element = as

	useEffect(() => {
		if (!transitionIn || !ref.current) return

		// Use Intersection Observer instead of motion's useInView
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					// Disconnect after first view for performance
					observer.disconnect()
				}
			},
			{
				threshold: 0.1, // Trigger when 10% is visible
				rootMargin: '50px' // Start animation slightly before element is visible
			}
		)

		observer.observe(ref.current)

		return () => observer.disconnect()
	}, [transitionIn])

	if (!children) {
		return false
	}

	return (
		<Element
			className={cx(className, {
				'scroll-entrance': transitionIn
			})}
			ref={transitionIn ? ref : null}
			delay={delay}
			data-in-view={inView}
			transform={transform}
			style={{ ...style, '--delay-value': delay }}
		>
			{children}
		</Element>
	)
}

export default ScrollEntrance
