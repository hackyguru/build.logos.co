import React from 'react'
import cx from 'classnames'
import { MdRemove, MdAdd } from 'react-icons/md'

const QuantityInput = ({
	className,
	onChange,
	value,
	isSoldOut,
	maxInventory,
	id = 'quantity-input',
	iconSize = 18
}) => {
	return (
		<div
			className={cx(className, "body items-center border rounded inline-flex secondary px-0")}
		>
			<button
				onClick={() => onChange(parseInt(value) - 1)}
				className="button circle transparent px-3 py-1 border rounded disabled:opacity-50"
				disabled={value <= 1 || isSoldOut}
				aria-label="Decrease quantity"
			>
				<MdRemove size={iconSize} />
			</button>
			<input
				id={id}
				type="number"
				className="text-center w-[2.5em] bg-transparent text-current"
				value={value}
				min={1}
				max={maxInventory}
				disabled={isSoldOut}
				aria-label="Product quantity"
				onChange={e =>
					onChange(parseInt(e.target.value) || 1)
				}
			/>
			<button
				onClick={() => onChange(parseInt(value) + 1)}
				className="button circle transparent px-3 py-1 border rounded disabled:opacity-50"
				disabled={value >= maxInventory || isSoldOut}
				aria-label="Increase quantity"
			>
				<MdAdd size={iconSize} />
			</button>
		</div>
	)
}

export default QuantityInput
