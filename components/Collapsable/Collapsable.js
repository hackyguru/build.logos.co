import React from 'react'
import cx from 'classnames'

const Collapsable = ({
	className = '',
	open = false,
	children,
	speed,
	animateOpacity = false,
	startHeight = false,
	delayIn,
	delayOut,
	style
}) => {
	return (
		<div
			className={cx(className, 'grid grid-cols-1 transition-[grid-template-rows] duration-(--speed)', {
				'min-h-(--start-height)': startHeight,
				'grid-rows-[1fr] delay-(--delay-in)': open,
				'grid-rows-[0fr] delay-(--delay-out)': !open
			})}
			aria-hidden={open ? 'false' : 'true'}
			aria-expanded={open ? 'true' : 'false'}
			style={{
				'--start-height': startHeight || '0px',
				'--speed': speed || 'var(--speed-md)',
				'--delay-in': delayIn || '0ms',
				'--delay-out': delayOut || '0ms',
				'--content-opacity': animateOpacity ? (open ? 1 : 0) : 1,
				contain: startHeight ? 'unset' : 'paint',
				overflow: startHeight ? 'hidden' : 'unset',
				...style
			}}
		>
			<div
				className={cx('opacity-(--content-opacity) transition-[visibility,opacity] duration-(--speed)', {
					'visible': startHeight && !open,
					'invisible': !startHeight && !open,
					'min-h-max delay-(--delay-in) visible': open,
					'min-h-(--start-height) delay-(--delay-out)': !open
				})}
			>
				{children}
			</div>
		</div>
	)
}

export default Collapsable