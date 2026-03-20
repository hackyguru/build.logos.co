"use client"

import React, { useState } from 'react'
import Section from '@components/Section'
import ContactForm from '@components/ContactForm'
import ScrollEntrance from '@components/ScrollEntrance'
import TextLockup from '@components/TextLockup'
import Container from '@components/Container'
import RichText from '@components/RichText'
import { AnimatePresence, motion } from 'motion/react'
import cx from 'classnames'

const ContactFormSection = ({
	className = '',
	theme = 'default',
	prevTheme,
	nextTheme,
	text,
	isFirstSection,
	paddingBottom,
	paddingTop,
	disclaimerText,
	form,
	forms = [],
	id
}) => {
	const [success, setSuccess] = useState(false)

	const activateSuccess = () => {
		setSuccess(true)
		setTimeout(() => {
			setSuccess(false)
		}, 5000)
	}
	return (
		<Section
			className={cx('section-contact-form-section', className)}
			setTheme={theme}
			prevTheme={prevTheme}
			nextTheme={nextTheme}
			isFirstSection={isFirstSection}
			paddingBottom={paddingBottom}
			paddingTop={paddingTop}
			id={id}
		>
			<Container wideMargins>
				<div className="relative">
					<ScrollEntrance className={cx('flex flex-col gap-x-gutter gap-y-v-space-sm max-w-narrow-width mx-auto')}>
						{text?.text && (
							<div className="md:col-start-2 md:col-span-2">
								<TextLockup lockup={text} alignment='center' className='text-balance max-w-[650px]' />
							</div>
						)}
						<div className='md:col-span-2 md:col-start-2 md:row-start-2'>
							<ContactForm
								form={form}
								disclaimerText={disclaimerText}
								onSuccess={activateSuccess}
								alignment={text?.text ? 'left' : 'center'}
							/>
						</div>
					</ScrollEntrance>

					<AnimatePresence>
						{(success && form.successText) && (
							<motion.div
								exit={{ opacity: 0 }}
								transition={{ duration: .5 }}
								className="text-center flex justify-center items-center absolute top-0 left-0 w-full h-full bg-bg z-2 scroll-entrance"
								data-in-view={true}
							>
								<RichText text={form.successText} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</Container>
		</Section>
	)
}

export default ContactFormSection
