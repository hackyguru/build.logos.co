'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Section from '@components/Section'
import AddToCartButton from '@components/AddToCartButton'
import QuantityInput from '@components/QuantityInput'
import Select from '@components/Input/Select'
import { useQueryState } from 'nuqs'

const ProductHero = ({
  className,
  product,
  theme = 'default',
  prevTheme = false,
  nextTheme = false,
  isFirstSection = true,
  isLastSection = true,
  flushToTop = true
}) => {
  const [currentVariant, setVariant] = useQueryState('variant')
  const [quantity, setQuantity] = useQueryState('quantity')

  const variants = product?.store?.variants || []
  const options = product?.store?.options || []

  const getInitialOptions = () => {
    const variantId = currentVariant
    const variant = variants.find(v => v.store.id.toString() === variantId)
    const preset = {}

    if (variant) {
      if (variant.store.option1) preset[options[0]?.name] = variant.store.option1
      if (variant.store.option2) preset[options[1]?.name] = variant.store.option2
      if (variant.store.option3) preset[options[2]?.name] = variant.store.option3
      return preset
    }

    const defaults = {}
    options.forEach(opt => {
      defaults[opt.name] = opt.values[0]
    })
    return defaults
  }

  const [selectedOptions, setSelectedOptions] = useState(getInitialOptions)

  const matchesVariant = (variant, selected) => {
    const o1 = options[0]?.name && selected[options[0].name]
    const o2 = options[1]?.name && selected[options[1].name]
    const o3 = options[2]?.name && selected[options[2].name]

    const v = variant?.store

    return (
      (!v.option1 || v.option1 === o1) &&
      (!v.option2 || v.option2 === o2) &&
      (!v.option3 || v.option3 === o3)
    )
  }

  const selectedVariant = variants.find(v => matchesVariant(v, selectedOptions)) || variants[0]

  const inventoryQty = selectedVariant?.store.inventory?.quantity
  const maxInventory = typeof inventoryQty === 'number' ? inventoryQty : Infinity
  const isSoldOut = selectedVariant?.store.availableForSale === false

  // Set selected options from URL on first load only
  useEffect(() => {
    if (!currentVariant) return

    const variantId = currentVariant
    const variant = variants.find(v => v.store.id === variantId)

    if (!variant) return

    const updated = {}
    if (variant.store.option1) updated[options[0]?.name] = variant.store.option1
    if (variant.store.option2) updated[options[1]?.name] = variant.store.option2
    if (variant.store.option3) updated[options[2]?.name] = variant.store.option3

    setSelectedOptions(updated)

    let q = quantity
    if (!q || q < 1 || Number.isNaN(q)) {
      q = 1
    }
    setQuantity(q)
  }, [currentVariant])

  // Update the URL when state changes
  useEffect(() => {
    if (!selectedVariant) return

    setVariant(selectedVariant.store.id)
    let q = quantity
    if (!q || q < 1 || Number.isNaN(q)) {
      q = 1
    }
    setQuantity(q)
  }, [selectedOptions, quantity])

  const handleOptionChange = (name, value) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = next => {
    const safeQty = Math.min(next, maxInventory)
    setQuantity(Math.max(1, safeQty))
  }

  // Variant-specific image
  const imageUrl = selectedVariant?.store?.image || product?.image

  if (!product) {
    return null
  }

  return (
    <Section
      className={className}
      setTheme={theme}
      prevTheme={prevTheme}
      nextTheme={nextTheme}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      flushToTop={flushToTop}
    >
      <div className="grid gap-y-gutter lg:grid-cols-2">
        <div className="col-span-1">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.title}
              width={1000}
              height={1000}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full h-auto object-cover"
            />
          )}
        </div>

        <div className="px-margin grid xl:grid-cols-6 gap-x-gutter">
          <div className="col-span-1 xl:col-span-4 xl:col-start-2 flex items-center justify-stretch">
            <div className="xl:max-w-[600px] w-full mx-auto space-y-6">
              <div>
                <h1 className="h1 text-balance">{product.title}</h1>
                <p className="body-large text-light-text mt-[.5em]">
                  ${Number(selectedVariant?.store?.price).toFixed(2)}
                </p>
              </div>
              {product.store?.descriptionHtml && (
                <div
                  className="rich-text body"
                  dangerouslySetInnerHTML={{
                    __html: product.store.descriptionHtml
                  }}
                />
              )}

              <div>
                {options.map(opt => {
                  if (opt.values.length < 2) {
                    return
                  }
                  return (
                    <div
                      key={opt.name}
                      className='grid grid-cols-2 items-center border-t border-hr py-1'
                    >
                      <label htmlFor={`option-${opt.name}`} className="block body">{opt.name}</label>
                      <Select
                        id={`option-${opt.name}`}
                        className="w-full underlined"
                        selectClassName="!border-none !px-0"
                        value={selectedOptions[opt.name]}
                        onChange={e => handleOptionChange(opt.name, e.target.value)}
                        aria-label={`Select ${opt.name}`}
                        options={opt.values.map(value => {
                          const hypothetical = { ...selectedOptions, [opt.name]: value }
                          const match = variants.find(v => matchesVariant(v, hypothetical))
                          const soldOut = match?.store?.availableForSale === false
                          const label = soldOut ? value + ' (Sold out)' : value
                          return (
                            {
                              value: value,
                              label: label,
                              disabled: soldOut
                            }
                          )
                        })}
                      >
                        {opt.values.map(value => {
                        const hypothetical = { ...selectedOptions, [opt.name]: value }
                        const match = variants.find(v => matchesVariant(v, hypothetical))
                        const soldOut = match?.store?.availableForSale === false
                        return (
                          <option key={value} value={value} disabled={soldOut}>
                            {value} {soldOut ? '(Sold out)' : ''}
                          </option>
                        )
                      })}
                      </Select>
                    </div>
                  )
                })}

                {selectedVariant && (
                  <div className='grid grid-cols-2 items-center border-t border-hr py-1'>
                    <label htmlFor="product-quantity" className="block body">Quantity</label>
                    <div>
                      <QuantityInput
                        onChange={handleQuantityChange}
                        value={quantity}
                        isSoldOut={isSoldOut}
                        maxInventory={maxInventory}
                        id="product-quantity"
                        className='!border-none -ml-[10px]'
                        iconSize={14}
                      />

                      {maxInventory <= 5 && Number.isFinite(maxInventory) && maxInventory > 0 && (
                        <p className="text-warning">Only {maxInventory} left in stock!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedVariant ? (
                <div>
                  {/* Selling plans (subscriptions) not implemented - add sellingPlan prop if needed */}
                  <AddToCartButton
                    product={product}
                    variant={selectedVariant}
                    variantId={selectedVariant.store.id}
                    variantGid={selectedVariant.store.gid}
                    quantity={quantity}
                    availableForSale={selectedVariant.store.availableForSale}
                  />
                </div>
              ) : (
                <p className="text-error">No matching variant found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default ProductHero