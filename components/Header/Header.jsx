"use client"

import React, { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from '@components/Link'
import Button from '@components/Button'
import RichText from '@components/RichText'
import TextLink from '@components/TextLink'
import { Logomark } from '@components/Logo'
import AnimatedIcon from '@components/AnimatedIcon'
import { MdKeyboardArrowDown } from 'react-icons/md'
import NavigationPanel from '@components/NavigationPanel'
import Collapsable from '@components/Collapsable'
import CartIcon from '@components/CartIcon'
import { getLinkProps, isBrowser, isEcommerceSite } from '@utils/helpers'
import { useWindowSize } from '@uidotdev/usehooks'
import { useLenis } from 'lenis/react'
import cx from 'classnames'

const showHideEffect = false

const HeaderNavItems = ({ items, className, dropdown, setDropdown }) => {
	const path = usePathname()
	if (!items || items?.length < 1) {
		return false
	}

	return (
		<ul className={cx(className, 'body flex items-baseline h-full -mx-half-gutter')}>
			{items.map(item => {
				const titleLink = item?.link
				const active = titleLink ? path === getLinkProps(titleLink)?.to : false

				if (item._type === 'link') {
					return (
						<li key={item._key} className='h-full'>
							<Link
								{...getLinkProps(item)}
								className={cx('transition-none! group cursor-pointer flex py-1 items-center h-full px-half-gutter', {
									'active': active
								})}
							>
								<span
									className="animate-underline transition-underline"
								>
									{item?.title || titleLink?.title || titleLink?.pageTitle}
								</span>
							</Link>
						</li>
					)
				} else if (item._type === 'button') {
					return (
						<li key={item._key} className='h-full px-half-gutter flex items-center'>
							<Button
								{...getLinkProps(item)}
								className={item?.theme || 'default'}
							>
								{item?.title || titleLink?.title || titleLink?.pageTitle}
							</Button>
						</li>
					)
				} else if (item._type === 'linkList') {
					const hasSublinks = item?.sublinks && item?.sublinks?.length > 0
					const dropdownActive = dropdown === item._key
					let LinkEl = 'div'
					let LinkProps = {}
					if (titleLink && getLinkProps(titleLink)?.to && !hasSublinks) {
						LinkEl = Link
						LinkProps = getLinkProps(titleLink)
					}
					
					if (hasSublinks) {
						LinkProps = {
							onMouseEnter: () => setDropdown(item._key)
						}
					}

					return (
						<li key={item._key} className='h-full'>
							<LinkEl
								{...LinkProps}
								className={cx('transition-none! group cursor-pointer flex py-1 items-center h-full px-half-gutter', {
									'active': active,
									'relative z-10': dropdownActive
								})}
							>
								<span
									className={cx("animate-underline transition-underline", {
										'active': dropdownActive,
									})}
								>
									{item?.title || titleLink?.title || titleLink?.pageTitle}
								</span>
								{(LinkEl === 'div' && hasSublinks) && (
									<MdKeyboardArrowDown className='ml-1 -mr-[4px]' size='1em'/>
								)}
							</LinkEl>
						</li>
					)
				}
			})}
		</ul>
	)
}

const Header = ({ header, headerOverlap, firstTheme }) => {
	const links = header?.links
	const topBanner = header?.topBanner
	const [menuVisible, setMenuVisible] = useState(false)
	const [scrollDirection, setScrollDirection] = useState(false)
	const [dropdown, setDropdown] = useState(false)
	const [atTop, setAtTop] = useState(true)
	const topBannerEl = useRef(null)
	const [bannerHeight, setBannerHeight] = useState(0)
	const scrollThreshold = bannerHeight > 0 ? bannerHeight : 10
	const { width: windowWidth } = useWindowSize()

	const toggleMenu = () => {
		setMenuVisible(!menuVisible)
	}

	const SCROLL_DELTA = 10 // Show Hide Sensitivity
	const lastScroll = useRef(0)

	const lenis = useLenis(({ scroll }) => {
		if (scroll >= scrollThreshold) {
			setAtTop(false)
		} else {
			setAtTop(true)
		}

		const delta = scroll - lastScroll.current

		if (showHideEffect) {
			if (delta > SCROLL_DELTA) {
				setScrollDirection('down')
			} else if (delta < -SCROLL_DELTA) {
				setScrollDirection('up')
			}
		}

		lastScroll.current = scroll
	})

	useEffect(() => {
		setBannerHeight(topBannerEl?.current?.getBoundingClientRect().height)
	}, [topBannerEl, windowWidth])

	useEffect(() => {
		if (isBrowser && bannerHeight) {
			document?.body?.style.setProperty('--spacing-header-banner-height', `${bannerHeight}px`)
			document?.body?.style.setProperty('--spacing-full-header-height', `calc(var(--spacing-header-height) + var(--spacing-header-banner-height))`)
		}
	}, [bannerHeight])

	useEffect(() => {
		if (!atTop) {
			// Collapsed header style
			// For show/hide effect on scroll up/down
			if (showHideEffect) {
				if (scrollDirection === 'down') {
					if (isBrowser) {
						// Change sticky top
						document?.body?.style?.setProperty('--spacing-sticky-top', `var(--spacing-gutter)`)
					}
				} else {
					if (isBrowser) {
						// Change sticky top
						document?.body?.style?.setProperty('--spacing-sticky-top', `calc(var(--spacing-gutter) + var(--spacing-header-height))`)
					}
				}
			}
		}
	}, [atTop, scrollDirection])

	// TODO: Logic for headerOverlap to invert header
	const firstThemeClassName = firstTheme && atTop && headerOverlap ? 'theme-' + firstTheme : false
	const transparentHeader = headerOverlap && atTop && !dropdown && !menuVisible
	const headerExpanded = atTop && !menuVisible

	return (
		<>
			{header?.topBanner?.text && (
				<div
					ref={topBannerEl}
					className="relative z-[12] px-margin py-1 theme-dark text-center body-small text-balance"
				>
					<RichText text={topBanner.text} className='text-balance' />
				</div>
			)}
			<div className="sticky top-0 z-[11] h-0">
				<header
					className={cx(
						'main-header',
						'transition-all',
						firstThemeClassName,
						{
							'bg-bg': !headerOverlap,
							'h-header-height-expanded': headerExpanded,
							'h-header-height': !headerExpanded,
							'text-bg': transparentHeader,
							'!bg-transparent': transparentHeader,
							'!bg-bg': !atTop || menuVisible || dropdown,
							'header-break:!bg-bg header-break:!text-text': dropdown,
							'-translate-y-full': scrollDirection === 'down' && !atTop && showHideEffect && !menuVisible && !dropdown
						}
					)}
				>
					<div className="px-margin grid grid-cols-2 gap-gutter items-center h-full">
						<div className='h-full flex items-center'>
							<TextLink to='/'>
								Logos
							</TextLink>
						</div>
						<div className="flex items-center h-full justify-between">
							<div className="w-1 grow h-full">
								{/*
								<span className="h6 h-full flex items-center gap-2 text-light-text">Full site coming soon</span>
								<button
									className="h6 h-full flex items-center gap-2 px-margin -mx-margin"
									onClick={toggleMenu}
									title={menuVisible ? 'Close Menu' : 'Open Menu'}
								>
									Menu <AnimatedIcon icon={menuVisible ? 'close' : 'equals'} width='11px' spacing='3px' />
								</button> */}
							</div>
							<div className='w-header-logo-width'>
								<Link to='/' title='Go to homepage' className='block'>
									<Logomark className='flex items-center'/>
								</Link>
							</div>
						</div>
					</div>
				</header>

				{/* DROPDOWNS */}
				{links?.map((link, index) => {
					const hasSublinks = link?.sublinks && link?.sublinks?.length > 0
					const dropdownActive = dropdown === link._key
					if (!hasSublinks) {
						return
					}
					return (
						<div
							key={link._key}
							className={cx("hidden header-break:block fixed top-0 left-0 w-full transition-[padding]", {
								'pointer-events-none': !dropdown,
								'pt-[calc(var(--spacing-header-height-expanded)+var(--spacing-header-banner-height))]': headerExpanded,
								'pt-header-height': !headerExpanded,
							})}
						>
							<div
								className={cx("absolute transition-[height,top] left-0 w-full z-1", {
									'h-header-height-expanded top-header-banner-height': headerExpanded,
									'h-header-height top-0': !headerExpanded
								})}
								onMouseEnter={() => setDropdown(false)}
							/>
							<Collapsable
								className='relative z-2 pointer-events-auto'
								open={dropdownActive}
								delayIn="200ms"
								speed="400ms"
							>
								<div className="w-full px-margin py-margin bg-light text-dark relative">
									<div className="absolute top-0 left-margin right-margin bg-current h-[1px]"/>
									<div className='flex items-start justify-between'>
										<div>
											<ul
												className='scroll-entrance'
												data-in-view={dropdownActive}
												style={{ '--delay-value': 6 }}
											>
												{link.sublinks.map(sublink => {
													return (
														<li key={sublink._key} className='pb-1'>
															<Link
																className='h4 animate-underline'
																{...getLinkProps(sublink)}
															>{sublink.title}</Link>
														</li>
													)
												})}
											</ul>
										</div>
									</div>
								</div>
							</Collapsable>
							{index === 0 && (
								<div
									className={cx("fixed bottom-0 left-0 w-full z-1 transition-all", {
										'bg-[rgba(0,0,0,.3)]': dropdown,
										'top-[calc(var(--spacing-header-height-expanded)+var(--spacing-header-banner-height))]': headerExpanded,
										'top-header-height': !headerExpanded,
									})}
									onMouseEnter={() => setDropdown(false)}
								/>
							)}
						</div>
					)	
				})}
			</div>

			<NavigationPanel
				items={links}
				open={menuVisible}
				path={usePathname()}
				closePanel={() => setMenuVisible(false)}
			/>
		</>
	)
}

export default Header
