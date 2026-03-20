import React from 'react'
import cx from 'classnames'

const Section = ({
	children,
	className = '',
	setTheme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	padded = true,
	paddedTop = true,
	paddedBottom = true,
	flushToTop = false,
	id,
	spaceBelow,
	spaceAbove,
	style
}) => {
	let paddingClassTop = 'pt-half-v-space'
	let paddingClassBottom = 'pb-half-v-space'
	let marginClassBottom = false

	if (spaceAbove === 'wide') {
		paddingClassTop = 'pt-v-space'
	}

	if (spaceBelow === 'wide') {
		paddingClassBottom = 'pb-v-space'
	}

	// Adjust padding based on section background color
	if (setTheme !== prevTheme) {
		paddingClassTop = 'pt-v-space'
		if (spaceAbove === 'wide') {
			paddingClassTop = 'pt-[calc(var(--spacing-v-space)+var(--spacing-v-space-sm))]'
		}
	}

	if (setTheme !== nextTheme) {
		paddingClassBottom = 'pb-v-space'
		if (spaceBelow === 'wide') {
			paddingClassBottom = 'pb-[calc(var(--spacing-v-space)+var(--spacing-v-space-sm))]'
		}
	}

	if (setTheme === nextTheme) {
		marginClassBottom = '-mb-[1px]' // Avoid half pixel gap between sections of the same color
	}

	if (isFirstSection && padded) {
		if (flushToTop) {
			paddingClassTop = 'pt-header-height-expanded'
		}
	}

	if (!paddedTop || spaceAbove === 'none') {
		paddingClassTop = ''
	}

	if (!paddedBottom || spaceBelow === 'none') {
		paddingClassBottom = ''
	}

	if (spaceAbove === 'slim') {
		paddingClassTop = 'pt-gutter'
	}

	if (spaceBelow === 'slim') {
		paddingClassBottom = 'pb-gutter'
	}
	
	let paddingClass = paddingClassTop + ' ' + paddingClassBottom

	if (!padded) {
		paddingClass = ''
	}

	const themeClass = 'theme-' + setTheme

	return (
		<section
			className={cx(paddingClass, className, marginClassBottom, themeClass)}
			id={id}
			style={style}
		>
			<div className={cx("pt-(--header-offset) w-full", {
				'pt-(--spacing-header-height-expanded)': isFirstSection && (padded !== false && paddedTop !== false)
			})}>
				{children}
			</div>
		</section>
	)
}

export default Section
