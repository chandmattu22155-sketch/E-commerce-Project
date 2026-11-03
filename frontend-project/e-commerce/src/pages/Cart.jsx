import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import ProductImage from '../components/ProductImage'
import CheckoutModal from '../components/CheckoutModal'
import { PageLoader } from '../components/Loader'
import { formatPrice } from '../utils/format'

const Cart = () => {
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { cart, isLoading, isError, error, isAuthenticated, busy, actionError, updateItem, removeItem } = useCart()

  if (isLoading) return <PageLoader text="Loading cart..." />
  if (isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <h1 className="text-xl font-bold text-gray-900">Unable to load your cart</h1>
          <p className="mt-2 text-sm text-red-600">{error?.message || 'Something went wrong.'}</p>
        </div>
      </main>
    )
  }

  const items = Array.isArray(cart?.items) ? cart.items : []
  const total = Number(cart?.total_price) || 0

  // CHANGED: login ho to modal khulta hai, warna login par bhejo (login ke baad wapas cart par)
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }
    setCheckoutOpen(true)
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-black sm:text-4xl">Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <section className="rounded-3xl bg-[#f5f3f2] px-5 py-16 text-center sm:py-20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <ShoppingBag className="h-7 w-7 text-gray-700" />
          </div>
          <h2 className="text-xl font-bold text-black sm:text-2xl">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white hover:bg-gray-800">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="min-w-0 rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 lg:col-span-7">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="font-bold text-black">Items ({items.length})</h2>
              <Link to="/shop" className="text-sm font-semibold text-gray-600 underline underline-offset-4 hover:text-black">
                Continue shopping
              </Link>
            </div>

            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  className="flex gap-3 border-b border-gray-100 py-5 last:border-b-0 last:pb-0 sm:gap-5"
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5f3f2] sm:h-28 sm:w-28"
                  >
                    <ProductImage src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="line-clamp-2 font-bold text-black hover:text-gray-600 sm:text-lg"
                          >
                            {item.product.title}
                          </Link>
                          <p className="mt-1 text-sm text-gray-500">{formatPrice(item.unit_price)} each</p>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeItem(item)}
                          className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* CHANGED: color aur size backend se aate hain */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span>Size: <strong className="font-semibold text-black">{item.size}</strong></span>
                        <span className="flex items-center gap-1.5">
                          Color: <strong className="font-semibold text-black">{item.color_name}</strong>
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.color_code }}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="flex items-center gap-3 rounded-full bg-[#f5f3f2] px-3 py-2">
                        <button
                          type="button"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => updateItem(item, item.quantity - 1)}
                          className="rounded-full text-black hover:opacity-60 disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-bold text-black">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={busy || item.quantity >= item.available_stock}
                          onClick={() => updateItem(item, item.quantity + 1)}
                          className="rounded-full text-black hover:opacity-60 disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-extrabold text-black">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {actionError && (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{actionError}</p>
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24 lg:col-span-5">
            <h2 className="text-xl font-extrabold text-black">Order Summary</h2>
            <div className="mt-6 space-y-4 border-b border-gray-100 pb-5 text-sm">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-600">
                <span>Delivery fee</span>
                <span className="font-semibold text-black">Free</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 py-5">
              <span className="text-lg font-extrabold text-black">Total</span>
              <span className="text-xl font-extrabold text-black">{formatPrice(total)}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={busy || items.length === 0}
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-4 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            {!isAuthenticated && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Your cart is saved. You only need to log in to place the order.
              </p>
            )}
          </aside>
        </div>
      )}

      <AnimatePresence>
        {checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}

export default Cart