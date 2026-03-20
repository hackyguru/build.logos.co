import React from 'react'
import { PortableText } from '@portabletext/react'
import components from './components'
import cx from 'classnames'

const RichText = ({ className = '', text, bodySize, wrapper = true }) => {
	if (!text) {
		return false
	}

	// Add markers to first and last items (without mutating props)
	const textWithMarkers = text.map((item, idx) => ({
		...item,
		firstItem: idx === 0,
		lastItem: idx === text.length - 1
	}))

	if (wrapper) {
		return (
			<div className={cx('rich-text', className, bodySize)}>
				<PortableText value={textWithMarkers} components={components} />
			</div>
		)
	}

	return (
		<PortableText value={textWithMarkers} components={components} />
	)
}

export default RichText
