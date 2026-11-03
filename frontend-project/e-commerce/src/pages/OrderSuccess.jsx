import { Link, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '../utils/format'

const OrderSuccess = () => {
  const location = useLocation()
  const order = location.state?.order

  
  if (!order) return <Navigate to="/account" replace />

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex justify-center mb-4"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </motion.div>

      <h1 className="text-3xl font-black mb-2">Order Placed!</h1>
      <p className="text-gray-500 text-sm mb-8">Thank you. Your order #{order.id} has been received.</p>

      <div className="border rounded-2xl p-6 text-left text-sm space-y-3 mb-8">
        <div className="space-y-1 border-b pb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
           <span>{item.quantity} × {item.product_title} ({item.color_name} / {item.size})</span>
              <span className="font-semibold text-black">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-base">
          <span>Total</span><span>{formatPrice(order.total_price)}</span>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1">Shipping to</p>
          <p className="text-gray-700">{order.shipping_info}</p>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-semibold">{order.status}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Link to="/account" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium">
          View My Orders
        </Link>
        <Link to="/shop" className="border px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess