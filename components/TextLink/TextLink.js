import React from 'react'
import Link from '@components/Link'
import cx from 'classnames'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const TextLink = ({
	className = '',
	label = undefined,
	children = null,
	underlined = true,
	arrow = false,
	arrowPosition = 'right',
	...props
}) => {
	return (
		<Link
			className={cx(
				className,
				'inline-flex gap-x-[.5em] items-center h6 relative pb-1 group'
			)}
			{...props}
		>
			{(arrow && arrowPosition === 'left') && (
				<div className='pb-[2px]'>
					<ArrowLeft size={15} />
				</div>
			)}
			<span
				className={cx('py-1 leading-none animate-underline', {
					'underlined': underlined && !arrow
				})}
				style={{
					'--underline-color': 'var(--color-border)'
				}}
			>
				{children || label}
			</span>
			{(arrow && arrowPosition !== 'left') && (
				<div className='pb-[2px]'>
					<ArrowRight size={15} />
				</div>
			)}
		</Link>
	)
}

export default TextLink
