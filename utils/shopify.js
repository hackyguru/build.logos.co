export const renderPrice = (price) => {
  if (!price) return ''
  return `$${(price / 100).toFixed(2)}`
}
