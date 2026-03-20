import React from 'react'
import { useCart } from '@/context/CartContext'
import cx from 'classnames'
import { BiCart } from 'react-icons/bi'

const CartIcon = ({ className }) => {
	const {
    cart,
		cartVisible,
		setCartVisible
  } = useCart()

	const itemCount = cart.length
	const cartLabel = itemCount > 0
		? `Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
		: 'Shopping cart'

	return (
		<button
			className={cx('relative inline-block align-top', className)}
			title={cartVisible ? 'Close Cart' : 'Open Cart'}
			aria-label={cartVisible ? 'Close shopping cart' : cartLabel}
			aria-expanded={cartVisible}
			onClick={() => setCartVisible(!cartVisible)}
		>
			<BiCart size={24} aria-hidden="true" />
			{itemCount > 0 && (
				<div
					className={cx(
						'bg-(--color-text)',
						'text-(--color-bg)',
						'px-[.3em]',
						'min-w-[1.3em]',
						'absolute',
						'top-[-.3em]',
						'right-[-.5em]',
						'body-tiny',
						'!text-[10px]',
						'rounded-[100px]',
						'h-[1.3em]',
						'font-semibold',
						'leading-none',
						'pt-[.1em]',
						'flex',
						'items-center',
						'justify-center'
					)}
					aria-hidden="true"
				>
					{itemCount}
				</div>
			)}
		</button>
	)
}

export default CartIcon
