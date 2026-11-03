export const CURRENCY = '$' 

export const formatPrice = (value) => `${CURRENCY}${Number(value || 0).toFixed(2)}`

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })


