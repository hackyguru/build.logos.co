import React from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import Button from '@components/Button'
import TextLink from '@components/TextLink'
import Arrow from '@components/Arrow'
import TextLockup from '@components/TextLockup'
import { MdEdit, MdArrowForward } from 'react-icons/md'
import Input from '@components/Input'
import AnimatedIconExample from './AnimatedIconExample'
import cx from 'classnames'
import { themes, themeClasses } from '@studio/schema/objects/theme'

const testerText = {
	h0: 'Hero Headline',
	h1: 'Header Style Number 1',
	h2: 'Header Style Number 2',
	h3: 'Header Style Number 3',
	h4: 'Header Style Number 4',
	h5: 'Header Style Number 5',
	h6: 'Header Style Number 6',
	blockquote: 'blockquote',
	p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}

const ThemeItem = ({ theme }) => {
	const themeClass = themeClasses[theme]
	const slugToTitle = slug => {
		if (!slug) return ''
		return slug
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	return (
		<div className={cx(themeClass, 'rounded p-gutter', {
			'inset-ring inset-ring-text/10': theme === 'default'
		})}>
			<div className="eyebrow bg-light-grey -mt-gutter -mx-gutter px-gutter py-gutter mb-gutter rounded-t">
				Theme Style
			</div>
			<TextLockup
				headline={slugToTitle(theme)}
				className='text-balance'
				text={<>
					<p>This is an example of what text and buttons will look like on this background color option.</p>
					<hr className='mt-gutter' />
				</>}
				actions={[
					{
						_key: '1',
						_type: 'button',
						title: 'Get Started'
					},
					{
						_key: '2',
						_type: 'button',
						title: 'Learn More',
						theme: 'secondary'
					},
					{
						_key: '3',
						_type: 'button',
						title: 'Disabled',
						disabled: true,
					},
					{
						_key: '4',
						title: 'Our Mission'
					}
				]}
			/>
		</div>
	)
}

const Divider = ({ children, className, border = true }) => {
	return (
		<Container className={className}>
			<div className={cx('h5 mb-v-space-sm', {
				'pb-gutter': children && border,
				'border-b border-hr': border
			})}>
				{children}
			</div>
		</Container>
	)
}

const GridCol = ({ className }) => {
	return (
		<div className={cx(className, "rounded-t w-full h-[400px] md:h-[800px] opacity-20 bg-ease-to-b from-error via-error to-transparent")}/>
	)
}

const SubsectionTitle = ({ children, className }) => {
	return (
		<h6 className={cx(className, "text-error opacity-50")}>{children}</h6>
	)
}

const TypographyItem = ({ children, type = 'p', className, showTitle = true, title }) => {
	let textClass = type
	if (className) {
		textClass = className
	}
	return (
		<div>
			{showTitle && (
				<SubsectionTitle className='mb-gutter'>{title || type}</SubsectionTitle>
			)}
			<div className={cx(textClass, 'max-w-[42em]', {
				'mt-gutter': !showTitle
			})}>
				{children || testerText[type]}
			</div>
		</div>
	)
}

const StyleguideTester = ({ className, headerOverlap }) => {
	return (
		<Section isFirstSection prevTheme={false} nextTheme={false} paddedTop={false}>
			<div className={cx('pt-[calc(var(--spacing-header-height-expanded)+var(--spacing-v-space-sm))] pb-v-space-sm', {
				'theme-dark': headerOverlap,
				'theme-light-grey': !headerOverlap
			})}>
				<Container>
					<div>
						<h1>Style Guide</h1>
					</div>
				</Container>
			</div>
			<div className="flex flex-col gap-y-v-space items-stretch pt-v-space-sm">
				<div>
					<Divider>Typography</Divider>
					<Container>
						<div className="grid gap-x-gutter gap-y-v-space-sm md:grid-cols-2">
							<div className='flex flex-col gap-y-v-space-sm'>
								<TypographyItem type="h0" className="h0 text-balance" />
								<TypographyItem type="h1" className="h1 text-balance" />
								<TypographyItem type="h2" className="h2 text-balance" />
								<TypographyItem type="h3" className="h3 text-balance" />
								<TypographyItem type="h4" className="h4 text-balance" />
								<TypographyItem type="h5" className="h5 text-balance" />
								<TypographyItem type="h6" className="h6 text-balance" />
								<TypographyItem className='allcaps' title="Allcaps">Allcaps</TypographyItem>
								<TypographyItem className='smallcaps' title="smallcaps">smallcaps</TypographyItem>
								<TypographyItem className='tinycaps' title="Tinycaps">Tinycaps</TypographyItem>
							</div>
							<div className='flex flex-col gap-y-v-space-sm'>
								<div>
									<TypographyItem type="p" title="Body Tiny" className='body-tiny'/>
								</div>
								<div>
									<TypographyItem type="p" title="Body Small" className='body-small'/>
								</div>
								<div>
									<TypographyItem type="p" title="Body (Default)" className='body'/>
								</div>
								<div>
									<TypographyItem type="p" title="Body Medium" className='body-medium'/>
								</div>
								<div>
									<TypographyItem type="p" title="Body Large" className='body-large'/>
								</div>
								<div>
									<TypographyItem type="blockquote"/>
								</div>
							</div>
						</div>
					</Container>
				</div>
				<div>
					<Divider>Color Themes</Divider>
					<Container>
						<div className="grid gap-gutter md:grid-cols-2 lg:grid-cols-3">
							{themes.map(theme => (
								<div key={theme}>
									<ThemeItem theme={theme} />
								</div>
							))}
						</div>
					</Container>
				</div>
				<div>
					<Divider>UI Components</Divider>
					<Container>
						<div className="grid gap-x-gutter gap-y-v-space-sm md:grid-cols-3">
							<div className='flex flex-col gap-y-v-space-sm'>
								<div className='flex flex-col gap-gutter'>
									<SubsectionTitle>Buttons & Links</SubsectionTitle>
									<div><Button>Button (Default)</Button></div>
									<div><Button className='secondary'>Button Secondary</Button></div>
									<div className='flex justify-start items-center gap-4'>
										<Button className='circle secondary' icon={<MdArrowForward size={18} />} />
										<p className="body-tiny text-light-text">
											<code>.circle.secondary</code>
										</p>
									</div>
									<div className='flex justify-start items-center gap-4'>
										<Button className='square' icon={<MdEdit />} />
										<p className="body-tiny text-light-text">
											<code>.square</code>
										</p>
									</div>
									<div className='flex justify-start items-center gap-4'>
										<Button className='circle unpadd transparent' icon={<MdEdit size={18} />} />
										<p className="body-tiny text-light-text">
											<code>.circle.unpadd.transparent</code>
										</p>
									</div>
								</div>
								<div className='flex flex-col gap-gutter'>
									<SubsectionTitle>Text Links</SubsectionTitle>
									<p className='body-small text-balance'>Text links are rendered in the <code>Actions</code> component where the CMS allows either a button or link.</p>
									<div><TextLink>Text Link</TextLink></div>
								</div>
							</div>
							<div className='flex flex-col gap-y-v-space-sm'>
								<div className='flex flex-col gap-gutter'>
									<SubsectionTitle>Inputs</SubsectionTitle>
									<div><Input label='Input Label' /></div>
								</div>
							</div>
							<div className='flex flex-col gap-y-v-space-sm'>
								<div className='grid grid-cols-4 gap-gutter'>
									<SubsectionTitle className='col-span-full w-full'>Arrows</SubsectionTitle>
									<p className='col-span-full body-small text-balance w-full'>The arrow component can be used seperately from the chosen icon set to allow for a special branded arrow icon. It has been broken out into its own component. <code>Arrow</code></p>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow /></div>
										<p className="body-tiny text-light-text">
											<code>default</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='left' /></div>
										<p className="body-tiny text-light-text">
											<code>left</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='up' /></div>
										<p className="body-tiny text-light-text">
											<code>up</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='down' /></div>
										<p className="body-tiny text-light-text">
											<code>down</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='up-right' /></div>
										<p className="body-tiny text-light-text">
											<code>up-right</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='down-right' /></div>
										<p className="body-tiny text-light-text">
											<code>down-right</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='up-left' /></div>
										<p className="body-tiny text-light-text">
											<code>up-left</code>
										</p>
									</div>
									<div className='flex flex-col justify-start items-start gap-2'>
										<div className="w-full bg-light-grey rounded aspect-square flex items-center justify-center"><Arrow direction='down-left' /></div>
										<p className="body-tiny text-light-text">
											<code>down-left</code>
										</p>
									</div>
								</div>
								<div className='grid gap-gutter'>
									<SubsectionTitle className='col-span-full w-full'>Menu Icon</SubsectionTitle>
									<p className='col-span-full body-small text-balance w-full'>In many occasions having the menu icon animate into a close icon is nice. Change the icon prop from <code>menu</code> to <code>close</code> and also change the <code>weight</code>, <code>width</code>, and <code>spacing</code> values.</p>
									<AnimatedIconExample />
								</div>
							</div>
						</div>
					</Container>
				</div>
				<div>
					<Divider>Grid</Divider>
					<Container>
						<div className="grid gap-x-gutter grid-cols-6 md:grid-cols-12">
							<GridCol />
							<GridCol />
							<GridCol />
							<GridCol />
							<GridCol />
							<GridCol />
							<GridCol className="hidden md:block" />
							<GridCol className="hidden md:block" />
							<GridCol className="hidden md:block" />
							<GridCol className="hidden md:block" />
							<GridCol className="hidden md:block" />
							<GridCol className="hidden md:block" />
						</div>
					</Container>
				</div>
			</div>
		</Section>
	)
}

export default StyleguideTester
