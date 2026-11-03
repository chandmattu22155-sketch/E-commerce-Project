import { request } from './api'

export const fetchCart = () => request('/cart/')


export const addToCart = ({ variantId, quantity }) =>
  request('/cart/add/', { method: 'POST', body: { variant_id: variantId, quantity } })

export const updateCartItem = ({ itemId, quantity }) =>
  request(`/cart/item/${itemId}/`, { method: 'PATCH', body: { quantity } })

export const removeFromCart = (itemId) =>
  request(`/cart/item/${itemId}/`, { method: 'DELETE' })