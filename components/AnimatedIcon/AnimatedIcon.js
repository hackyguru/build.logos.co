import cx from 'classnames'

export const AnimatedIcon = ({
	icon = 'menu', // menu, close, plus, minus, equals
	weight = '2px',
	width = '24px',
	spacing = '4px',
	speed = 'var(--default-transition-duration)'
}) => {
	return (
		<div
			style={{
				'--width': width,
				'--weight': weight,
				'--spacing': spacing,
				'--height': 'calc(var(--weight) * 3 + var(--spacing) * 2)',
				'--speed': speed
			}}
			className={cx("duration-(--speed) ease-zip transition-transform w-(--width) h-(--height) flex flex-col justify-between", {
				'rotate-[135deg]': icon === 'close',
				'rotate-0': icon === 'plus',
				'rotate-[180deg]': icon === 'minus'
			})}
		>
			<div className={cx("duration-(--speed) ease-zip transition-transform h-(--weight) w-full bg-current", {
				'translate-y-[calc(var(--height)/2-var(--weight)/2)]': icon === 'close' || icon === 'plus' || icon === 'minus',
				'rotate-90': icon === 'close' || icon === 'plus',
				'rotate-0': icon === 'minus',
				'translate-y-[calc(var(--spacing))]': icon === 'equals'
			})}/>
			<div className={cx("duration-(--speed) ease-zip transition-[scale,opacity] h-(--weight) w-full bg-current", {
				'opacity-50 scale-x-0': icon === 'close' || icon === 'plus' || icon === 'minus' || icon === 'equals'
			})}/>
			<div className={cx("duration-(--speed) ease-zip transition-transform h-(--weight) w-full bg-current", {
				'-translate-y-[calc(var(--height)/2-var(--weight)/2)]': icon === 'close' || icon === 'plus' || icon === 'minus',
				'-translate-y-[calc(var(--spacing))]': icon === 'equals'
			})}/>
		</div>
	)
}

export default AnimatedIcon