import React from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import RichText from '@components/RichText'
import TextLockup from '@components/TextLockup'
import ScrollEntrance from '@components/ScrollEntrance'
import cx from 'classnames'

const TwoColumnText = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	id,
	leftColumn,
	rightColumn,
	actions,
	...props
}) => {
	return (
		<Section
			className={cx('section-two-column-text', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			isLastSection={isLastSection}
			id={id}
			{...props}
		>
			<Container>
				<div className="flex flex-col gap-gutter md:grid md:grid-cols-12">
					<ScrollEntrance className="text-balance md:col-span-5 2xl:col-span-4">
						<RichText text={leftColumn} />
					</ScrollEntrance>
					<div className="md:col-span-6 md:col-start-7 xl:col-span-6 xl:col-start-7">
						<TextLockup
							text={rightColumn}
							actions={actions}
							entranceDelay={3}
						/>
					</div>
				</div>
			</Container>
		</Section>
	)
}

export default TwoColumnText
