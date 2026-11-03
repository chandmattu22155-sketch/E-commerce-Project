import { request } from './api'

export const fetchProducts = ({ category, search, min_price, max_price, color, size } = {}) => {
  const query = new URLSearchParams()
  
  if (category) query.set('category', category)
  if (search) query.set('search', search)
  if (min_price) query.set('min_price', min_price)
  if (max_price) query.set('max_price', max_price)
  if (color) query.set('color', color)
  if (size) query.set('size', size)

  const qs = query.toString()
  return request(`/store/products/${qs ? `?${qs}` : ''}`, { auth: false })
}

export const fetchProductDetail = (id) => request(`/store/products/${id}/`, { auth: false })

export const fetchCategories = () => request('/store/categories/', { auth: false })