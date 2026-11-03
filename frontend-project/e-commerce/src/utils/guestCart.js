const KEY = 'guest_cart'
export const GUEST_CART_EVENT = 'guest-cart-changed'

export const getGuestItems = () => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(data) ? data.filter((i) => i && i.variant_id) : []
  } catch {
    return []
  }
}

const save = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(GUEST_CART_EVENT))
}

export const addGuestItem = (product, variant, quantity) => {
  const items = getGuestItems()
  const existing = items.find((i) => i.variant_id === variant.id)
  const newQty = (existing ? existing.quantity : 0) + quantity

  if (newQty > variant.stock) throw new Error(`Only ${variant.stock} items in stock.`)

  const entry = {
    variant_id: variant.id,
    quantity: newQty,
    color_name: variant.color_name,
    color_code: variant.color_code,
    size: variant.size,
    stock: variant.stock,
    product: {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      final_price: product.final_price || product.price,
    },
  }

  if (existing) Object.assign(existing, entry)
  else items.push(entry)
  save(items)
}

export const setGuestQuantity = (variantId, quantity) => {
  const items = getGuestItems()
  const item = items.find((i) => i.variant_id === variantId)
  if (!item) return
  if (quantity > item.stock) throw new Error(`Only ${item.stock} items in stock.`)
  item.quantity = quantity
  save(items)
}

export const removeGuestItem = (variantId) =>
  save(getGuestItems().filter((i) => i.variant_id !== variantId))

export const clearGuestCart = () => save([])