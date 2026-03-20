import React from 'react'
import Link from '@components/Link'
import { getLinkProps } from '@utils/helpers'
import Logo from '@components/Logo'
import Media from '@components/Media'
import cx from 'classnames'

const LinkList = ({ items, title, className }) => {
	if (!items || items?.length < 1) {
		return false
	}

	return (
		<div>
			{title && (
				<h6 className='mb-[4px]'>
					{title}
				</h6>
			)}
			<ul className={cx(className, 'body-tiny')}>
				{items.map(item => {
					const titleLink = item?.link

					if (item._type === 'link') {
						return (
							<li key={item._key}>
								<Link
									{...getLinkProps(item)}
									className='transition-none! group cursor-pointer inline-block align-top py-[2px]'
								>
									<span
										className="animate-underline underlined py-[2px]"
									>
										{item?.title || titleLink?.title || titleLink?.pageTitle}
									</span>
								</Link>
							</li>
						)
					} else if (item._type === 'simpleText') {
						return (
							<li key={item._key}>
								<div>
									{item?.text}
								</div>
							</li>
						)
					}
				})}
			</ul>
		</div>
	)
}

const Footer = ({ footer, site }) => {
	const lists = footer?.lists
	const secondaryLinks = footer?.linksSecondary
	const tertiaryLinks = footer?.linksTertiary

	return (
		<>
			<footer className='theme-dark'>
				<div className='px-margin pt-margin pb-v-space-sm'>
					<div className="grid gap-x-gutter gap-y-v-space grid-cols-4 md:grid-cols-6">
						<div className="md:row-span-2 md:col-span-2 lg:col-span-1">
							{footer?.footerMedia && (
								<div className="relative aspect-video theme-light-grey flex items-center justify-center">
									<Media media={footer.footerMedia} sizes='400px' layout='cover' />
								</div>
							)}
						</div>
						<div className="col-span-full col-start-3 row-start-1 md:col-start-4 md:row-start-1">
							<div className="md:grid gap-x-gutter md:grid-cols-3">
								<div className="w-[65px] mb-8 md:mb-0">
									<Logo />
								</div>
								{footer.tagline && (
									<p className="body serif text-balance md:col-start-3 max-w-[12em] md:max-w-full">{footer.tagline}</p>
								)}
							</div>
						</div>
						{lists?.map((list, index) => {
							return (
								<div
									key={list._key}
									className={cx({
										'md:row-start-2': index < 2,
										'col-start-3 md:col-start-6': index % 2,
										'col-start-1 md:col-start-4': index % 2 === 0
									})}
								>
									<LinkList
										title={list.title}
										items={list.links}
									/>
								</div>
							)
						})}

						<div
							className='col-start-1 md:col-start-4'
						>
							<LinkList
								items={secondaryLinks}
							/>
						</div>

						<div
							className='col-start-3 md:col-start-1 md:row-start-3'
						>
							<LinkList
								items={tertiaryLinks}
							/>
						</div>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
