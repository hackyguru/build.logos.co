import React from 'react'
import cx from 'classnames'

const Arrow = ({
	className,
	direction = 'right',
	weight = 2,
	width = 18,
	height = 14
}) => {
	width = typeof width === 'number' ? width + 'px' : (width || '20px')
	return (
		<div
			style={{
				'--arrow-weight': weight ? weight + 'px' : '2px',
				'--arrow-width': width,
				'--arrow-height': height ? height + 'px' : '12px'
			}}
			className={cx(className, 'transition', {
				'rotate-90': direction === 'down',
				'-rotate-90': direction === 'up',
				'rotate-180': direction === 'left',
				'-rotate-45': direction === 'up-right',
				'rotate-45': direction === 'down-right',
				'-rotate-[135deg]': direction === 'up-left',
				'rotate-[135deg]': direction === 'down-left',
			})}
		>
			<div className="w-(--arrow-width) h-(--arrow-height) flex items-center">
				<div className="grow h-(--arrow-weight) max-h-(--arrow-weight) bg-current -mr-(--arrow-height)"></div>
				<div
					className="w-[calc(var(--arrow-height)*.85)] h-[calc(var(--arrow-height)*.85)] border-current -rotate-45 mx-(--arrow-weight)"
					style={{
						borderWidth: '0 var(--arrow-weight) var(--arrow-weight) 0'
					}}
				/>
			</div>
		</div>
	)
}

export default Arrow
