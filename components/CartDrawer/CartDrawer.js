'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import Button from '@components/Button'
import LiveRegion from '@components/LiveRegion'
import Image from 'next/image'
import { renderPrice } from '@/utils/shopify'
import { MdClose } from 'react-icons/md'
import cx from 'classnames'

const CartDrawer = () => {
  const {
    cart,
    updateQuantity,
    updateSellingPlan,
    removeItem,
    clearCart,
    createCheckout,
		cartVisible,
		setCartVisible
  } = useCart()

  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const url = await createCheckout()
    window.location.href = url
  }

  return (
    <aside className={cx("fixed right-0 top-0 w-full lg:w-[66.666%] xl:w-1/2 max-w-[650px] h-full bg-bg p-gutter overflow-y-auto z-50", {
			'hidden': !cart || cart.length === 0 || !cartVisible
		})}>
			<LiveRegion message={loading ? 'Processing checkout. Redirecting to Shopify...' : ''} />
			<div className="flex justify-between items-center">
				<h2 className="h4">Your Cart {cart.length > 0 && `(${cart.length})`}</h2>
				<button
					title='Close Cart'
					aria-label='Close cart'
					onClick={() => setCartVisible(false)}
				><MdClose size={18} aria-hidden="true" /></button>
			</div>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => {
						const product = item.data.product
						const variant = item.data.variant
						return (
							<div key={index} className="mb-6 border-b pb-4">
								<div className="flex items-center gap-4">
									{variant?.previewImageUrl && (
										<div className="w-16 h-16">
											<Image
												src={variant.previewImageUrl + '&width=400&height=400&crop=center'}
												alt={product.title + ' - ' + variant.title}
												width={400}
												height={400}
												className=""
											/>
										</div>
									)}
									<div>
										<h4>{product?.title}</h4>
										<p className='body-small'>{variant?.title}</p>

										{variant.availableSellingPlans?.length > 0 && (
											<select
												value={variant.selectedSellingPlanId || ''}
												onChange={(e) =>
													updateSellingPlan(
														variant.gid,
														variant.selectedSellingPlanId,
														e.target.value || null
													)
												}
												aria-label={`Purchase option for ${product.title}`}
												className="mt-1"
											>
												{variant.availableSellingPlans.map((plan) => (
													<option key={plan.id || 'one-time'} value={plan.id || ''}>
														{plan.name} – ${plan.price}
													</option>
												))}
											</select>
										)}

										{renderPrice(variant.price, variant.compareAtPrice)}

										×

										<input
											type="number"
											min="1"
											value={item.quantity}
											onChange={(e) =>
												updateQuantity(
													item.variantId,
													item.selectedSellingPlanId,
													parseInt(e.target.value)
												)
											}
											aria-label={`Quantity for ${product.title}`}
											className="w-16 mt-2"
										/>

										<Button
											title={`Remove ${product.title} from cart`}
											aria-label={`Remove ${product.title} from cart`}
											shape="circle"
											size="small"
											className='transparent unpadd'
											icon={<MdClose aria-hidden="true" />}
											onClick={() =>
												removeItem(item.variantId, item.selectedSellingPlanId)
											}
										/>
									</div>
								</div>
							</div>
          	)
					})}

					<div className="flex flex-col justify-stretch gap-gutter">
						<Button
							className="w-full bg-black text-white py-3 mt-4"
							onClick={handleCheckout}
							disabled={loading}
						>
							{loading ? 'Redirecting...' : 'Checkout'}
						</Button>

						<Button
							className="transparent"
							onClick={clearCart}
						>
							Clear Cart
						</Button>
					</div>
        </>
      )}
    </aside>
  )
}

export default CartDrawer