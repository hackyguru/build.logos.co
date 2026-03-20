"use client"

import React, { useState, useEffect, Fragment } from 'react'
import Input from '@components/Input'
import Select from '@components/Input/Select'
import RichText from '@components/RichText'
import Button from '@components/Button'
import LiveRegion from '@components/LiveRegion'
import { validateEmail } from '@utils/validation'
import { useForm } from '@formspree/react'
import { MdCheck, MdCircle } from 'react-icons/md'
import { AnimatePresence, motion } from 'motion/react'
import dynamic from 'next/dynamic'
import cx from 'classnames'
import '@/app/styles/react-datepicker.css'

// Lazy load DatePicker - only loads when form has a date field
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false })

const RequiredMarker = ({ required = false }) => {
	if (!required) {
		return false
	}
	return (
		<span className='text-red bold'>*</span>
	)
}

const ErrorMessage = ({ children, className, visible }) => {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: .5 }}
				>
					<p className={cx('text-error body-small !font-bold mt-2 text-balance', className)}>
						{children}
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

const ContactForm = ({
	className = '',
	onSuccess,
	disclaimerText,
	form,
	alignment = 'left'
}) => {
	const formId = form?.formspreeId
	const [formData, setFormData] = useState({})
	const [submitable, setSubmitable] = useState(false)
	const [errors, setErrors] = useState([])
	const [formErrors, setFormErrors] = useState([])
	const [loadingState, setLoadingState] = useState(false)
	const [successState, setSuccessState] = useState(false)

	// Formspree form state
	const [state, handleSubmit] = useForm(formId)

	const getUtmParams = () => {
		if (typeof window === 'undefined') return
		const urlParams = new URLSearchParams(window.location.search)

		return Object.fromEntries(urlParams.entries())
	}

	const resetForm = () => {
		setFormData({})
		setSuccessState(false)
		setFormErrors([])
		setErrors([])
		setLoadingState(false)
	}

	const preSubmit = event => {
		if (!submitable) {
			event.preventDefault()
			setFormErrors(errors)
		}
	}

	const onSubmit = async (e) => {
		preSubmit(e)
		if (!submitable) {
			return
		}
		setLoadingState(true)
    e.preventDefault()

		const allUtmParams = getUtmParams()
		// Submit to Formspree
		handleSubmit({ ...formData, ...allUtmParams })
		// anything else we want to do with the form data...
  }

	const handledOtherInput = (name, value) => {
		setFormData({...formData, [name]: value})
	}

	const setDisabled = () => {
		const requiredValues = []
		const fieldErrors = []
		form?.fields?.forEach(field => {
			if (field.required) {
				let valid = true
				if (field.fieldType === 'email') {
					valid = validateEmail(formData[field.name])
					if (!valid && !fieldErrors.includes(field.name)) {
						fieldErrors.push(field.name)
					}
				}
				if (formData[field.name] && valid) {
					requiredValues.push(true)
				} else {
					requiredValues.push(false)
					if (!fieldErrors.includes(field.name)) {
						fieldErrors.push(field.name)
					}
				}
			}
		})

		setErrors(fieldErrors)

		if (fieldErrors?.length > 0 || loadingState) {
			setSubmitable(false)
		} else {
			setSubmitable(true)
		}
	}

	useEffect(() => {
		if (state?.succeeded && onSuccess) {
			setSuccessState(true)
			onSuccess()
		}
	}, [state])

	useEffect(() => {
		setDisabled()
	}, [formData])

	useEffect(() => {
		setDisabled()
	}, [loadingState])

	useEffect(() => {
		const defaultData = {}
		form?.fields?.forEach(field => {
			if (field?.defaultOption) {
				if (field.fieldType === 'checkbox') {
					defaultData[field.name] = [field.defaultOption]
				} else {
					defaultData[field.name] = field?.defaultOption
				}
			}
		})
		setFormData(defaultData)
	}, [])

	const setCheckboxValue = event => {
		let currentField = formData[event.target.name] ? formData[event.target.name] : []

		if (!Array.isArray(formData[event.target.name])) {
			currentField = []
		}

		if (formData[event?.target?.name] !== event?.target?.value && !formData[event?.target?.name]?.includes(event?.target?.value)) {
			const newValue = currentField.concat(event.target.value)
			setFormData({...formData, [event.target.name]: newValue})
		} else {
			const newValue = currentField.filter(item => item !== event.target.value);
			setFormData({...formData, [event.target.name]: newValue})
		}
	}

	const submitButtonClass = () => {
		if (successState) {
			return 'button contact-form-submit solid success'
		}

		if (submitable) {
			return 'button contact-form-submit solid'
		}
		
		return 'button contact-form-submit solid'
	}

	const inputClassName = 'body medium'

	// Screen reader announcement message
	const getAnnouncementMessage = () => {
		if (successState) {
			return 'Form submitted successfully. Thank you for your submission.'
		}
		if (loadingState) {
			return 'Submitting form, please wait...'
		}
		if (formErrors.length > 0) {
			return `Form has ${formErrors.length} error${formErrors.length > 1 ? 's' : ''}. Please correct the highlighted fields.`
		}
		return ''
	}

	return (
		<div className={className}>
			<LiveRegion message={getAnnouncementMessage()} />
			<form onSubmit={onSubmit}>
				<div className='grid gap-gutter md:grid-cols-6'>
					{form?.fields.map((field, index) => {
						if (!field.name) {
							field.name = field.label
						}

						if (!field._key) {
							field._key = field.name + '-' + index
						}
						let colSpan = 'col-span-full'
						if (field.width === '1/2') {
							colSpan = 'col-span-full lg:col-span-3'
						}
						if (field.width === '1/3') {
							colSpan = 'col-span-full md:col-span-2'
						}

						if (field._type === 'gap') {
							return <div key={field._key} className={colSpan + ' hidden md:block h-[1px]'} />
						} else if (field.fieldType === 'text' ||
								field.fieldType === 'number' || 
								field.fieldType === 'email' || 
								field.fieldType === 'phone' ||
								field.fieldType === 'utm') {
							let type = false

							let fieldErrorMessage = 'Please fill out the above field'
							
							if (field.fieldType === 'email') {
								fieldErrorMessage = 'Please enter a valid email address'
							}
							
							if (field.fieldType === 'phone') {
								type = "tel"
								fieldErrorMessage = 'Please enter a valid phone number'
							}

							return (
								<div key={field._key} className={colSpan}>
									<Input
										error={formErrors?.length > 0 && errors.includes(field.name)}
										className={inputClassName}
										label={<>{field.label}<RequiredMarker required={field.required} /></>}
										name={field.name}
										type={type || field.fieldType}
										onChange={(event) => setFormData({...formData, [field.name]: event?.target?.value})}
										value={formData[field?.name] ? formData[field.name] : ''}
									/>
									<ErrorMessage visible={formErrors?.length > 0 && errors.includes(field.name)}>{fieldErrorMessage}</ErrorMessage>
								</div>
							)
						} else if (field.fieldType === 'date' || field.fieldType === 'time') {
							return (
								<div key={field._key} className={colSpan}>
									<div className={cx(inputClassName, "input-component relative w-full has-label", {
										'has-value': formData[field?.name],
										'error': formErrors?.length > 0 && errors.includes(field.name)
									})}>
										<label
											htmlFor='checkInOut'
											className='input-label'
										>
											{field.label}<RequiredMarker required={field.required} />
										</label>
										<DatePicker
											isClearable={false}
											// selected={formData[field?.name] ? formData[field.name] : new Date()}
											selected={formData[field?.name]}
											className={cx(inputClassName, 'input')}
											// showTimeSelect={true}
											// showTimeSelectOnly={true}
											// dateFormat="h:mm aa"
											id='checkInOut'
											onChange={(update) => {
												setFormData({
													...formData,
													[field.name]: update
												})
											}}
											// placeholderText="Select Date Range"
										/>
									</div>
									<ErrorMessage visible={formErrors?.length > 0 && errors.includes(field.name)}>Please fill out the above field</ErrorMessage>
								</div>
							)
						} else if (field.fieldType === 'textarea') {
							return (
								<div className={cx(colSpan, inputClassName)} key={field._key}>
									<Input
										error={formErrors?.length > 0 && errors.includes(field.name)}
										type='textarea'
										inputClassName='!p-4'
										className={inputClassName}
										label={<>{field.label}<RequiredMarker required={field.required} /></>}
										name={field.name}
										onChange={(event) => setFormData({...formData, [field.name]: event.target.value})}
										value={formData[field?.name] ? formData[field.name] : ''}
										style={{
											'--textarea-height': '100px'
										}}
									/>
									<ErrorMessage visible={formErrors?.length > 0 && errors.includes(field.name)}>Please fill out the above field</ErrorMessage>
								</div>
							)
						} else if ((field.fieldType === 'radio' || field.fieldType === 'checkbox') && field?.options?.length > 0) {
							const options = field?.options
							if (!options || options?.length < 1) {
								return false
							}
							return (
								<div className={colSpan} key={field._key}>
									<div>
										<p className="body mb-2">
											{field.label}<RequiredMarker required={field.required} />
										</p>
										<ErrorMessage
											error={formErrors?.length > 0 && errors.includes(field.name)}
											className="!mt-0 mb-2"
											visible={formErrors?.length > 0 && errors.includes(field.name)}
										>Please select an option below</ErrorMessage>
										<div className="flex flex-col gap-y-[6px]">
											{options.map((option, index) => {
												let checked = false
												if (field.fieldType === 'checkbox') {
													checked = formData[field.name]?.includes(option)
												}
												if (field.fieldType === 'radio') {
													checked = formData[field.name] === option
												}
												return (
													<div key={field._key + '-option-' + index}>
														<label
															htmlFor={field._key + '-option-' + index}
															className='group body cursor-pointer inline-flex items-start justify-start'
														>
															<input
																className='hidden'
																type={field.fieldType}
																id={field._key + '-option-' + index}
																name={field.name}
																value={option}
																checked={!!checked}
																onChange={(event) => {
																	if (field.fieldType === 'checkbox') {
																		setCheckboxValue(event)
																	} else {
																		setFormData({...formData, [field.name]: event.target.value})
																	}
																}}
															/>
															<div
																className={cx("mt-[calc(.5em-6px)] mr-[.75em] grow-0 shrink-0 w-[14px] h-[14px] flex items-center justify-center border border-current", {
																	'rounded-full p-[2px]': field.fieldType === 'radio'
																})}
															>
																{field.fieldType === 'radio' ? (
																	<>
																		{/* <span className="w-full h-full rounded-full bg-transparent group-has-[:checked]:bg-current"></span> */}
																		<MdCircle size={'1em'} className='text-transparent group-has-[:checked]:text-current' />
																	</>
																) : (
																	<MdCheck size={'1em'} className='text-transparent group-has-[:checked]:text-current' />
																)}
															</div>
															<span className='grow'>
																{option}
															</span>
														</label>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							)
						} else if (field.fieldType === 'select' && field?.options?.length > 0) {
							const options = field?.options
							if (!options || options?.length < 1) {
								return false
							}

							let optionArray = options.map(option => (
								{ value: option, label: option }
							))

							if (!field.defaultOption) {
								optionArray?.unshift({ value: false })
							}

							const otherInputKey = 'Other: ' + field.name

							return (
								<Fragment key={field._key}>
									<div className={colSpan}>
										<div className={inputClassName}>
											<label htmlFor={field.label} className='hidden'>{field.label}</label>
											<Select
												error={formErrors?.length > 0 && errors.includes(field.name)}
												className={inputClassName}
												name={field.name}
												id={field.name}
												label={<>{field.label}<RequiredMarker required={field.required} /></>}
												onChange={(event) => {
													delete formData[otherInputKey]
													setFormData({...formData, [field.name]: event.target.value})
												}}
												value={formData[field.name]}
												options={optionArray}
											/>
											<ErrorMessage visible={formErrors?.length > 0 && errors.includes(field.name)}>Please select an option above</ErrorMessage>
										</div>
									</div>
									{formData[field.label]?.toLowerCase()?.includes('other') && (
										<div className='col-span-full'>
											<Input
												className={inputClassName}
												label={<>{field.label}<RequiredMarker required={field.required} /></>}
												name={field.name}
												autoFocus
												onChange={(event) => handledOtherInput(otherInputKey, event.target.value)}
												value={formData[otherInputKey]}
											/>
										</div>
									)}
								</Fragment>
							)
						}
						return (
							<div key={field._key}>Field: {field.fieldType}</div>
						)
					})}
				</div>

				<div className={cx('flex flex-col gap-gutter pt-10', {
					'md:flex-row': disclaimerText
				})}>
					{disclaimerText && (
						<div><RichText text={disclaimerText} className='md:text-balance body-small max-w-[50em]' bodySize='body-small'/></div>
					)}
					<div className={cx('flex', {
						'md:justify-end': disclaimerText,
						'justify-center': alignment === 'center'
					})}>
						<Button
							// disabled={!submitable}
							as='button'
							type='submit'
							className={submitButtonClass()}
						>{successState ? 'Thank You' : (form?.submitLabel || 'Submit')}</Button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default ContactForm
