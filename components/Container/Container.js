import React from 'react'
import cx from 'classnames'

const Container = ({ className, children, as }) => {
	let WrapperElement = as || 'div'
	return (
		<WrapperElement className={cx('mx-auto px-margin max-w-site-max-w-margin', className)}>
			{children}
		</WrapperElement>
	)
}

export default Container
