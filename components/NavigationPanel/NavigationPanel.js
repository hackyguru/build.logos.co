"use client"

import React, { useEffect, useState } from 'react'
import { LazyMotion, domAnimation, AnimatePresence, m } from 'motion/react'
import Link from '@components/Link'
import Collapsable from '@components/Collapsable'
import Container from '@components/Container'
import Actions from '@components/Actions'
import { MdKeyboardArrowDown } from 'react-icons/md'
import cx from 'classnames'
import { getLinkProps } from '@utils/helpers'
import { useLenis } from 'lenis/react'

const NavigationPanel = ({ open = false, closePanel, items = [], path, footer, rightLinks }) => {
	const [expandedSection, setExpandedSection] = useState()
	const [itemsVisible, setItemsVisible] = useState(false)
	const lenis = useLenis()

	const expandSection = id => {
		if (expandedSection === id) {
			setExpandedSection(false)	
		} else {
			setExpandedSection(id)
		}
	}

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				setItemsVisible(true)
			}, 300)
			lenis?.stop()
		} else {
			setItemsVisible(false)
			lenis?.start()
		}
	}, [open, lenis])

	return (
		<LazyMotion features={domAnimation}>
			<AnimatePresence>
				{open && (
					<m.div
						className={cx('fixed top-0 left-0 w-full h-full z-10 bg-bg flex flex-col')}
						initial={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							ease: [0.42, 0, 0.58, 1], // equivalent to easeInOut
						}}
					>
						<Container className='grow w-full flex flex-col items-stretch justify-center pt-header-height pb-margin'>
							<div className={cx("h-[1px] w-full bg-current grow-0 shrink-0 transition duration-slow origin-left", {
								'scale-x-0': !itemsVisible
							})}/>
							<div className="w-full grow flex flex-col justify-center items-stretch">
								<ul className={cx('body flex flex-col items-baseline scroll-entrance')} data-in-view={itemsVisible}>
									{items?.map(link => {
										const titleLink = link.link
										const active = path === getLinkProps(titleLink).to
										const hasSublinks = link?.sublinks && link?.sublinks?.length > 0

										return (
											<li key={link._key}>
												{hasSublinks ? (
													<button className='inline-flex h1 items-center justify-start align-top' onClick={() => expandSection(link._key)}>
														<span className={cx('align-top animate-underline py-[.1em]', { 'active': active })}>
															{titleLink?.title || titleLink?.link?.pageTitle}
														</span>
														<MdKeyboardArrowDown
															size={24}
															className='inline-block align-middle mt-[.2em] ml-[.25em]'
															direction={expandedSection === link._key ? 'up' : 'down'}
														/>
													</button>
												) : (
													<Link {...getLinkProps(titleLink)} className='group/nav-link inline-flex items-center justify-start align-top'>
														<span className={cx('align-top h1 animate-underline py-[.1em]', { 'active': active })}>
															{titleLink?.title || titleLink?.link?.pageTitle}
														</span>
													</Link>
												)}

												{hasSublinks && (
													<Collapsable open={expandedSection === link._key}>
														<ul className='h4 pt-[.75em] pb-[2em] scroll-entrance' data-in-view={expandedSection === link._key}>
															{link.sublinks.map(sublink => {
																const sublinkActive = path === getLinkProps(sublink).to
																return (
																	<li key={sublink._key}>
																		<Link {...getLinkProps(sublink)} className={cx('group/sublink inline-block align-top relative h4 py-[.2em] ml-margin', { 'active': sublinkActive })}>
																			<span className="animate-underline">{sublink?.title || sublink?.link?.pageTitle}</span>
																		</Link>
																	</li>)
															})}
														</ul>
													</Collapsable>
												)}
											</li>
										)
									})}
								</ul>
							</div>
							<div
								className="scroll-entrance grow-0 shrink-0 pb-6"
								data-in-view={itemsVisible}
							>
								<Actions
									actions={rightLinks}
									className='!gap-2 flex-col items-stretch'
									buttonClass='arrow-button'
									arrows={true}
								/>
							</div>
						</Container>
					</m.div>
				)}
			</AnimatePresence>
		</LazyMotion>
	)
}

export default NavigationPanel

