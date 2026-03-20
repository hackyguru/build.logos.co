"use client"

import React, { useState, useRef } from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import Link from '@components/Link'
import TextLink from '@components/TextLink'
import Actions from '@components/Actions'
import RichText from '@components/RichText'
import Slideshow from '@components/Slideshow'
import Image from '@components/Image'
import Button from '@components/Button'
import { Logomark } from '@components/Logo'
import cx from 'classnames'
import { getLinkProps } from '@utils/helpers'
import ScrollEntrance from '@components/ScrollEntrance'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const ResourceList = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	title,
	text,
	actions,
	layout = 'list',
	allowLayoutToggle,
	mobileSlideshow = false,
	items,
	backLink,
	borderTop,
	id,
	itemLimit,
	paginate,
	showLogomark,
	...props
}) => {
	const [listLayout, setListLayout] = useState(layout)
	const [paginatePage, setPaginatePage] = useState(1)
	const listRef = useRef(null)

	const goToPage = (page) => {
		if (!listRef.current) {
			setPaginatePage(page)
			return
		}

		const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
		const target = listRef.current.getBoundingClientRect().top + window.scrollY - headerHeight
		const start = window.scrollY
		const distance = target - start
		const duration = 600
		let startTime = null

		setPaginatePage(page)

		const step = (timestamp) => {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / duration, 1)
			const ease = progress < 0.5
				? 4 * progress * progress * progress
				: 1 - Math.pow(-2 * progress + 2, 3) / 2
			window.scrollTo(0, start + distance * ease)
			if (progress < 1) requestAnimationFrame(step)
		}

		requestAnimationFrame(step)
	}
	
	if (!items || items?.length < 1) {
		return false
	}

	const perPage = itemLimit || items.length
	const totalPages = paginate ? Math.ceil(items.length / perPage) : 1
	const visibleItems = paginate
		? items.slice((paginatePage - 1) * perPage, paginatePage * perPage)
		: itemLimit
			? items.slice(0, itemLimit)
			: items

	let ListWrapperEl = 'ol'
	let listWrapperClass = null
	let listWrapperProps = {}
	if (listLayout === 'grid') {
		listWrapperClass = cx({
			'grid gap-gutter sm:grid-cols-2 xl:grid-cols-4': listLayout === 'grid'
		})
		listWrapperProps = { className: listWrapperClass + ' px-margin' }

		if (mobileSlideshow) {
			ListWrapperEl = Slideshow
			listWrapperProps = {
				slidesXs: 1.1,
				slidesSm: 1.2,
				slidesMd: 1.2,
				slidesLg: 1.2,
				slidesXl: 1.2,
				slides2xl: 1.2,
				arrows: false,
				breakpoints: {
					'(min-width: 768px)': { active: false }
				},
				className: 'px-margin',
				containerClassname: listWrapperClass
			}
		} else {
			ListWrapperEl = 'div'
		}
	}

	return (
		<Section
			className={className}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			isLastSection={isLastSection}
			id={id}
			{...props}
		>
			{(title || allowLayoutToggle) && (
				<div ref={listRef}>
					{borderTop && (
						<hr className='mb-v-space-sm'/>
					)}
					{backLink && (
						<Container className='mb-v-space-sm'>
							<TextLink
								{...getLinkProps(backLink)}
								arrow
								arrowPosition='left'
							>
								{backLink.title}
							</TextLink>
						</Container>
					)}
					<Container className='mb-v-space-sm'>
						<ScrollEntrance className={cx({
							'lg:grid lg:gap-gutter lg:grid-cols-2': actions && allowLayoutToggle,
							'grid gap-gutter grid-cols-2': !(actions && allowLayoutToggle)
						})}>
							{title && (
								<div className={cx({
									'flex gap-gutter justify-between mb-6 lg:mb-0': actions && allowLayoutToggle
								})}>
									<h2 className='h3 text-balance flex gap-3'>
										{showLogomark && (
											<div className="w-[.6em] text-grey-3 pt-[.15em]">
												<Logomark />
											</div>
										)}
										{title}
									</h2>
									{(actions && allowLayoutToggle) && (
										<div className="lg:hidden">
											<Actions
												actions={actions}
												arrows={false}
											/>
										</div>
									)}
								</div>
							)}
							{(text || actions?.length > 0 || allowLayoutToggle) && (
								<div className={cx('space-y-gutter col-start-2', {
									'lg:grid lg:gap-gutter lg:grid-cols-3': actions
								})}>
									<div className={cx({
										'lg:col-span-2': actions
									})}>
										<RichText
											text={text}
											bodySize='body-tiny'
											className='max-w-[26em]'
										/>

										{allowLayoutToggle && (
											<div className={cx("flex gap-2", {
												'mt-8': text
											})}>
												<button
													className="body-tiny"
													onClick={() => setListLayout('grid')}
												>
													<span className={cx('animate-underline', { 'active h6': listLayout === 'grid' })}>
														Grid
													</span>
												</button>
												<span className='body-tiny'>/</span>
												<button
													className="body-tiny"
													onClick={() => setListLayout('list')}
												>
													<span className={cx('animate-underline', { 'active h6': listLayout === 'list' })}>
														List
													</span>
												</button>
											</div>
										)}
									</div>
									<Actions
										actions={actions}
										arrows={false}
										className={cx({
											'hidden lg:flex': actions && allowLayoutToggle
										})}
									/>
								</div>
							)}
						</ScrollEntrance>
					</Container>
				</div>
			)}
			<ScrollEntrance key={listLayout}>
				<ListWrapperEl
					{...listWrapperProps}
				>
					{visibleItems?.map((item, i) => {
						const index = paginate ? (paginatePage - 1) * perPage + i : i
						let ItemContentEl = 'div'
						let itemContentProps = {}

						if (item?.actions?.length === 1) {
							ItemContentEl = Link
							itemContentProps = getLinkProps(item.actions[0])
						}

						if (listLayout === 'grid') {
							return (
								<div key={item._key}>
									<ItemContentEl
										{...itemContentProps}
										className={cx(
											'p-gutter border rounded-[12px] h-full flex flex-col gap-gutter',
											'aspect-square',
											{
												'transition-[background] hover:bg-main!': ItemContentEl === Link && item?.actions?.length === 1
											}
										)}
									>
										<div className="w-full grow">
											<p className="h4 sans text-balance max-w-[14em]">
												{item.title}
											</p>
											{item.text2 && (
												<div className='body-tiny mt-4'>
													{item.text2}
												</div>
											)}
											<Actions
												actions={item.actions}
												arrows={false}
												className='mt-gutter'
												alwaysButton={item.text2}
												themes={['secondary']}
											/>
										</div>
										<div className="w-full grid grid-cols-3 gap-gutter">
											<div className='body-tiny col-span-2 flex items-end'>
												<div className="max-w-[26em]">
													{item.text}
												</div>
											</div>
											<div className="aspect-3/4 relative">
												<Image alt={item.title} image={item.image} size="300px" layout='contain' imgClassName='object-bottom-right!' />
											</div>
										</div>
									</ItemContentEl>
								</div>
							)
						}

						return (
							<li
								key={item._key}
								className={cx('theme-light-grey', {
									'bg-[#1525210D]!': index % 2
								})}
							>
								<ItemContentEl
									{...itemContentProps}
									className={cx("px-margin py-gutter flex gap-y-gutter flex-wrap lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:min-h-[70px]", {
										'transition-[background] hover:bg-main!': ItemContentEl === Link && item?.actions?.length === 1
									})}
								>
									<div className="grow sm:grow-0 flex gap-1 items-baseline sm:w-[calc(50%-var(--spacing-gutter)/2)] sm:mr-gutter lg:col-span-6 lg:mr-0 lg:w-full">
										<span className="body grow-0 shrink-0 w-[2em]">
											{String(index + 1).padStart(2, '0')}
										</span>
										<span className="body serif">
											{item.title}
										</span>
									</div>
									<div className={cx('order-3 w-full lg:order-2 lg:col-span-4', {
										'sm:pl-[calc(50%+var(--spacing-gutter)/2)] lg:pl-0': !item.text2,
										'grid grid-cols-4 gap-gutter lg:block': item.text2
									})}>
										<p className={cx("text-balance body-tiny whitespace-pre-wrap max-w-[32em] lg:ml-0 lg:w-full", {
											'col-span-3 sm:col-span-2': item.text2
										})}>
											{item.text}
										</p>

										{item.text2 && (
											<div className='col-span-1 sm:col-span-2 sm:col-span-2 lg:hidden body-tiny whitespace-pre-wrap text-right sm:text-left'>
												{item.text2}
											</div>
										)}
									</div>
									<div className={cx('order-2 lg:order-3 lg:col-span-2', {
										'lg:grid lg:grid-cols-2 lg:gap-gutter': item.text2
									})}>
										<div className='hidden lg:block body-tiny whitespace-pre-wrap'>
											{item.text2}
										</div>
										<Actions
											actions={item.actions}
											arrows={false}
										/>
									</div>
								</ItemContentEl>
							</li>
						)
					})}
				</ListWrapperEl>
			</ScrollEntrance>
			{paginate && totalPages > 1 && (
				<Container className='mt-v-space-sm'>
					<div className="flex items-center justify-center">
						<Button
							className={cx('transparent circle small', {'opacity-40 pointer-events-none': paginatePage <= 1 })}
							disabled={paginatePage <= 1}
							onClick={() => goToPage(paginatePage - 1)}
							title="Previous page"
							icon={<ArrowLeft size={15} />}
						/>
						{(() => {
							const maxVisible = 5
							let start = Math.max(1, paginatePage - Math.floor(maxVisible / 2))
							let end = start + maxVisible - 1
							if (end > totalPages) {
								end = totalPages
								start = Math.max(1, end - maxVisible + 1)
							}
							const pages = []
							for (let i = start; i <= end; i++) {
								pages.push(
									<button
										key={i}
										className={cx('body-tiny h-[24px] px-[8px]', {
											'underline underline-offset-4 h6': i === paginatePage,
											'body-tiny': i !== paginatePage
										})}
										onClick={() => goToPage(i)}
									>
										{i}
									</button>
								)
							}
							return pages
						})()}
						<Button
							className={cx('transparent circle small', { 'opacity-40 pointer-events-none': paginatePage >= totalPages })}
							disabled={paginatePage >= totalPages}
							onClick={() => goToPage(paginatePage + 1)}
							aria-label="Next page"
							icon={<ArrowRight size={15} />}
						/>
					</div>
				</Container>
			)}
		</Section>
	)
}

export default ResourceList
