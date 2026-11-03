import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { loginUser, fetchProfile } from '../services/authService'
import { addToCart } from '../services/cartService'
import { getGuestItems, clearGuestCart } from '../utils/guestCart'
import { setCredentials, logout } from '../slices/authSlice'

const mergeGuestCart = async () => {
  for (const item of getGuestItems()) {
    try {
      await addToCart({ variantId: item.variant_id, quantity: item.quantity })   // CHANGED
    } catch {}
  }
  clearGuestCart()
}

export const useLogin = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  return async ({ email, password }) => {
    const tokens = await loginUser({ email, password })
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh) 
    
    const user = await fetchProfile()
    await mergeGuestCart() 
    await queryClient.invalidateQueries({ queryKey: ['cart'] }) 

    dispatch(setCredentials({ user, access: tokens.access, refresh: tokens.refresh }))
  }
}

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    dispatch(logout())
    queryClient.clear()
    navigate('/')
  }
}