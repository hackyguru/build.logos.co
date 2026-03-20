import React from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import Media from '@components/Media'
import RichText from '@components/RichText'
import Actions from '@components/Actions'

const BannerStrip = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	isFirstSection,
	isLastSection,
	id,
	media,
	text,
	actions,
	...props
}) => {
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
			<Container>
				<div className="grid gap-gutter grid-cols-2">
					<div className='grid gap-gutter grid-cols-5 xl:grid-cols-6'>
						<div className="col-span-3 sm:col-span-2 xl:col-span-1">
							<Media media={media} className='max-w-[150px]' />
						</div>
					</div>
					<div className='space-y-gutter xl:space-y-0 xl:grid gap-x-gutter xl:grid-cols-3'>
						<div className='xl:col-span-2'>
							<RichText text={text} bodySize='body-tiny' className='max-w-[26em]' />
						</div>
						<div>
							<Actions actions={actions} arrows={false} />
						</div>
					</div>
				</div>
			</Container>
		</Section>
	)
}

export default BannerStrip
