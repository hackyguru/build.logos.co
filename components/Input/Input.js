"use client"

import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import cx from 'classnames'
import PhoneInput from 'react-phone-number-input'
import '@/app/styles/react-phone-number-input.css'

export const renderIcon = (icon, size, iconPosition, theme) => {
	let renderedIcon = false
	let iconClassName = 'input-icon absolute flex items-center justify-center top-0 pointer-events-none overflow-hidden w-(--input-height) h-(--input-height)'
	if (iconPosition === 'right') {
		iconClassName += ' right-0'
	} else {
		iconClassName += ' left-0'
	}
	renderedIcon = <div className={iconClassName} size={size} theme={theme}>{icon}</div>
	return renderedIcon
}

const Input = ({
	value,
	type = 'text',
	icon,
	iconPosition = 'left',
	loading,
	error,
	success,
	disabled,
	onClick,
	theme = 'default',
	inputClass,
	setTheme = false,
	className,
	size = 'medium',
	autoFocus = false,
	placeholder,
	label,
	spellCheck = false,
	name,
	style,
	onChange = () => {}
}) => {
	const [focused, setFocused] = useState(false)

	const setFocusState = () => {
		if (value) {
			setFocused(true)
		} else {
			setFocused(false)
		}
	}

	const isPhoneInput = ['tel', 'phone'].includes(type)

	const inputWrapperClassName = cx(
		'input-component relative inline-block w-full body',
		className,
		size,
		{
			'error': error,
			'success': success,
			'loading': loading,
			'disabled': disabled,
			'has-label': label,
			'has-value': value,
			'has-placeholder': placeholder,
			'pr-(--input-height)': icon && iconPosition === 'right',
			'pl-(--input-height)': icon && iconPosition !== 'right' && icon,
			[`icon-${iconPosition}`]: icon && iconPosition
		}
	)

	const inputClassName = 'input'

	return (
		<div
			className={inputWrapperClassName} theme={setTheme || theme} data-focused={focused}
			style={style}
		>
			{type !== 'textarea' ? (
				isPhoneInput ? (
					<PhoneInput
						defaultCountry="US"
						className={cx(inputClassName, inputClass)}
						placeholder={placeholder}
						disabled={disabled}
						onClick={onClick}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocusState()}
						autoFocus={autoFocus}
						value={value}
						name={name}
						id={name}
						onChange={event => {
							if (onChange) {
								onChange({ target: { value: event } })
							}
							if (event) {
								setFocused(true)
							}
						}}
					/>
				) : (
					<input
						className={cx(inputClassName, inputClass)}
						type={type}
						placeholder={placeholder}
						disabled={disabled}
						onClick={onClick}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocusState()}
						autoFocus={autoFocus}
						onChange={event => {
							if (onChange) {
								onChange(event)
							}
							if (event?.target?.value) {
								setFocused(true)
							}
						}}
						value={value}
						name={name}
						id={name}
						spellCheck={spellCheck}
					/>
				)
			) : (
				<TextareaAutosize
					className={cx(inputClassName, inputClass)}
					placeholder={placeholder}
					disabled={disabled}
					onClick={onClick}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocusState()}
					id={name}
					spellCheck={spellCheck}
					name={name}
					value={value}
					onChange={event => {
						if (onChange) {
							onChange(event)
						}
						if (event?.target?.value) {
							setFocused(true)
						}
					}}
				/>
			)}
			{label && (
				<label
					icon={icon}
					size={size}
					htmlFor={name}
					className='input-label'
				>
					{label}
				</label>
			)}
			{icon && (
				renderIcon(icon, size, iconPosition, theme)
			)}
		</div>
	)
}

export default Input
