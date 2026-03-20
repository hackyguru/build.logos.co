import React from 'react'
import RichText from '@components/RichText'
import ScrollEntrance from '@components/ScrollEntrance'
import Actions from '@components/Actions'
import cx from 'classnames'

const TextLockup = ({
	className = '',
	lockup,
	alignment = 'left',
	alignmentMobile,
	headline,
	text,
	eyebrow,
	actions,
	headlineEl = 'h3',
	headlineSize = 'h3',
	bodySize,
	entranceDelay = 0
}) => {
	if (!alignmentMobile) {
		alignmentMobile = alignment
	}
	if (lockup?.headline) {
		headline = lockup?.headline
	}
	if (lockup?.text) {
		text = lockup?.text
	}
	if (lockup?.eyebrow) {
		eyebrow = lockup?.eyebrow
	}
	if (lockup?.actions) {
		actions = lockup?.actions
	}

	const HeadlineEl = headlineEl

	return (
		<ScrollEntrance
			delay={entranceDelay}
			className={cx('rich-text flex flex-col justify-start', className, {
				'text-center mx-auto items-center': alignmentMobile === 'center',
				'text-left justify-start mx-0 items-start': alignmentMobile !== 'center',
				'md:text-center md:mx-auto md:items-center': alignment === 'center',
				'md:text-left md:items-start md:justify-start md:mx-0': alignment !== 'center'
			})}
		>
			{eyebrow && (<div className="eyebrow mb-6">{eyebrow}</div>)}
			
			{headline && Array.isArray(headline) ? (
				<RichText text={headline} />
			) : (
				headline && (
					<HeadlineEl className={headlineSize}>{headline}</HeadlineEl>
				)
			)}

			{text && Array.isArray(text) ? (
				<RichText text={text} bodySize={bodySize} wrapper={false} />
			) : (
				<div className={bodySize}>{text}</div>
			)}

			<Actions
				actions={actions}
				alignment={alignment}
				className='mt-8'
			/>
		</ScrollEntrance>
	)
}

export default TextLockup
