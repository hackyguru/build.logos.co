import React from 'react'
import TextLink from '@components/TextLink'
import Button from '@components/Button'
import { getLinkProps } from '@utils/helpers'
import cx from 'classnames'
import { DynamicIcon } from 'lucide-react/dynamic'

const Actions = ({
	actions,
	className,
	alignment = 'left',
	arrows = true,
	alwaysButton = false,
	themes = []
}) => {
	if (!actions || actions.length < 1) {
		return false
	}



	let alignmentClass = 'justify-start'
	if (alignment === 'center') {
		alignmentClass = 'justify-center'
	}

	return (
		<div
			className={cx(
				className,
				alignmentClass,
				'flex flex-wrap gap-gutter items-baseline'
			)}
		>
			{actions.map((action, index) => {
				if (!action.title) {
					return false
				}
				if (action._type === 'button' || alwaysButton) {
					return (
						<Button
							key={action._key}
							disabled={action.disabled}
							arrow={!action.icon}
							icon={<DynamicIcon name={action.icon} size={15} />}
							iconPosition='right'
							className={cx(
								'!m-0',
								themes[index] || action.theme
							)}
							{...getLinkProps(action)}
						>
							{action.title}
						</Button>
					)
				} else {
					return (
						<TextLink
							key={action._key}
							{...getLinkProps(action)}
							className='!m-0'
							arrow={arrows}
						>
							{action.title}
						</TextLink>
					)
				}
			})}
		</div>
	)
}

export default Actions
