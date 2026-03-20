"use client"

import React, { useState } from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import RichText from '@components/RichText'
import Collapsable from '@components/Collapsable'
import TextLockup from '@components/TextLockup'
import { MdKeyboardArrowDown } from 'react-icons/md'
import cx from 'classnames'
import ScrollEntrance from '@components/ScrollEntrance'
import AnimatedIcon from '@components/AnimatedIcon'

const AccordionSection = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	text,
	sections,
	button,
	rowIcon = 'plus',
	id,
	...props
}) => {
	const [currentItem, setCurrentItem] = useState(false)

	const setAccordionItem = id => {
		if (currentItem === id) {
			setCurrentItem(false)	
		} else {
			setCurrentItem(id)
		}
	}

	return (
		<Section
			className={cx('section-accordion-section', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			id={id}
			{...props}
		>
			<Container>
				<ScrollEntrance className="max-w-narrow-width mx-auto">
					<div className="max-w-[650px] mx-auto">
						{text && (
							<TextLockup lockup={text} alignment='center' className='sm:text-balance mb-v-space-sm'/>
						)}
					</div>
					<div>
						{sections.map((section, index) => {
							return (
								<div
									className={cx('flex flex-col', {
										'mt-v-space lg:mt-v-space-sm': index !== 0
									})}
									key={section._key}
								>
									{section?.title && (
										<h3 className="h6 mb-3">{section.title}</h3>
									)}
									{section?.accordion?.map((item, index) => {
										if (!item.title || !item.content) {
											return false
										}

										const itemKey = section._key + item._key
										const active = currentItem && currentItem === itemKey

										return (
											<div key={item._key}>
												{index === 0 && (
													<hr />
												)}
												<button
													onClick={() => setAccordionItem(itemKey)}
													className='py-[.6em] w-full text-left group/accordion-item flex items-start body justify-between'
												>
													<div className={cx('transition-[color] grow max-w-[700px] sm:text-balance pt-[.1em]', {
														'text-light-text': active
													})}>{item.title}</div>
													<div className="h-[1.5em] flex items-center justify-end grow-0 shrink-0">
														{rowIcon === 'arrow' ? (
															<MdKeyboardArrowDown size={18} className={cx('transition-transform mt-[.2em]', { '-rotate-180': active })} />
														) : (
															<AnimatedIcon icon={active ? 'minus' : 'plus'} width={'16px'} />
														)}
													</div>
												</button>
												<Collapsable open={active}>
													<div className="pb-gutter">
														<RichText text={item.content} className='max-w-[42em] body' />
													</div>
												</Collapsable>
												<hr />
											</div>
										)
									})}
								</div>
							)
						})}
					</div>
				</ScrollEntrance>
			</Container>
		</Section>
	)
}

export default AccordionSection
