import React from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import TextLockup from '@components/TextLockup'
import cx from 'classnames'

const TextSection = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	text,
	alignment,
	id,
	...props
}) => {
	return (
		<Section
			className={cx('section-text-section', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			isLastSection={isLastSection}
			id={id}
			{...props}
		>
			<Container className={cx({
				"sm:px-v-space": alignment === 'center'
			})}>
				<div className={cx({
					'sm:text-balance': alignment === 'center'
				})}>
					<TextLockup
						lockup={text}
						alignment={alignment}
						className={cx({
							'max-w-[800px]': alignment === 'center',
							'max-w-[1000px]': alignment !== 'center'
						})}
					/>
				</div>
			</Container>
		</Section>
	)
}

export default TextSection
