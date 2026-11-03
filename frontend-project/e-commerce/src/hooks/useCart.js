import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCart, updateCartItem, removeFromCart } from '../services/cartService'
import {
  getGuestItems,
  setGuestQuantity,
  removeGuestItem,
  GUEST_CART_EVENT,
} from '../utils/guestCart'

const useGuestItems = () => {
  const [items, setItems] = useState(getGuestItems)

  useEffect(() => {
    const sync = () => setItems(getGuestItems())
    window.addEventListener(GUEST_CART_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(GUEST_CART_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return items
}

// CHANGED: guest cart ko bilkul server wale cart jaisi shakal dete hain
const buildGuestCart = (items) => {
  const mapped = items.map((i) => {
    const unit = Number(i.product.final_price ?? i.product.price) || 0
    return {
      id: i.variant_id,
      variant_id: i.variant_id,
      product: i.product,
      color_name: i.color_name,
      color_code: i.color_code,
      size: i.size,
      quantity: i.quantity,
      available_stock: i.stock,
      unit_price: unit,
      subtotal: unit * i.quantity,
    }
  })
  return {
    items: mapped,
    total_price: mapped.reduce((sum, i) => sum + i.subtotal, 0),
  }
}

export const useCart = () => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const guestItems = useGuestItems()
  const [guestError, setGuestError] = useState('')

  const serverQuery = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  })

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => queryClient.setQueryData(['cart'], data),
  })

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const cart = isAuthenticated ? serverQuery.data : buildGuestCart(guestItems)
  const count = (cart?.items || []).reduce((sum, i) => sum + i.quantity, 0)

  const updateItem = (item, quantity) => {
    if (isAuthenticated) {
      updateMutation.mutate({ itemId: item.id, quantity })
      return
    }
    try {
      setGuestQuantity(item.variant_id, quantity)
      setGuestError('')
    } catch (err) {
      setGuestError(err.message)
    }
  }

  const removeItem = (item) => {
    if (isAuthenticated) removeMutation.mutate(item.id)
    else removeGuestItem(item.variant_id)
  }

  return {
    cart,
    count,
    isAuthenticated,
    isLoading: isAuthenticated && serverQuery.isLoading,
    isError: isAuthenticated && serverQuery.isError,
    error: serverQuery.error,
    busy: updateMutation.isPending || removeMutation.isPending,
    actionError:
      updateMutation.error?.message || removeMutation.error?.message || guestError,
    updateItem,
    removeItem,
  }
}