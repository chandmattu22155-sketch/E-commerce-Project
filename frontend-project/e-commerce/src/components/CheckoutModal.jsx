import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createOrder } from '../services/orderService'
import { formatPrice } from '../utils/format'

const Field = ({ label, optional, ...props }) => (
  <div>
    <label className="text-xs font-bold block mb-1">
      {label} {optional && <span className="font-normal text-gray-400">(optional)</span>}
    </label>
    <input
      required={!optional}
      {...props}
      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black transition"
    />
  </div>
)

const CheckoutModal = ({ cart, onClose }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useSelector((state) => state.auth)

  // Profile se pehle se bhar do, customer badal sakta hai
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address_line: '',
    city: '',
    postal_code: '',
    country: 'Pakistan',
  })

  const setField = (name) => (e) => setForm({ ...form, [name]: e.target.value })

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      navigate('/order-success', { state: { order }, replace: true })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })

  // Escape se band, aur peeche ka page scroll na ho
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()])
    )
    orderMutation.mutate(payload)
  }

  const items = cart?.items || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black">Checkout</h2>
        <p className="mt-1 mb-5 text-xs text-gray-500">
          Apni delivery ki information likhein aur order confirm karein.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" value={form.full_name} onChange={setField('full_name')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" type="email" value={form.email} onChange={setField('email')} />
            <Field label="Phone Number" value={form.phone_number} onChange={setField('phone_number')} maxLength={15} />
          </div>
          <Field label="Address" value={form.address_line} onChange={setField('address_line')} placeholder="House, street, area" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" value={form.city} onChange={setField('city')} />
            <Field label="Postal Code" optional value={form.postal_code} onChange={setField('postal_code')} />
            <Field label="Country" value={form.country} onChange={setField('country')} />
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-sm">
            <div className="space-y-1 border-b pb-3 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-gray-600">
                  <span className="truncate">
                    {item.quantity} × {item.product.title} ({item.color_name} / {item.size})
                  </span>
                  <span className="font-semibold text-black">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment</span>
              <span className="font-semibold text-black">Cash on Delivery</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(cart?.total_price)}</span>
            </div>
          </div>

          {orderMutation.isError && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {orderMutation.error.message}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={orderMutation.isPending}
            className="w-full rounded-full bg-black py-3.5 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {orderMutation.isPending ? 'Placing order...' : 'Confirm Order'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CheckoutModal