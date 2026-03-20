import { useCart } from '@/context/CartContext'
import Button from '@components/Button'

const AddToCartButton = ({
	variant,
	product,
	variantId,
	variantGid,
	quantity,
	availableForSale,
	className
}) => {
  const { addItem } = useCart()

  const handleClick = () => {
    if (availableForSale) {
      addItem({
				variantId: variantGid,
				quantity: quantity,
				product: product,
				variant: variant
			})
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!availableForSale}
			className={className}
			size="large"
    >
      {availableForSale ? 'Add to Cart' : 'Sold Out'}
    </Button>
  )
}

export default AddToCartButton