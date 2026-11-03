import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Settings, LogOut } from 'lucide-react'
import { fetchMyOrders } from '../services/orderService'
import { updateProfile } from '../services/authService'
import { updateUser } from '../slices/authSlice'
import { useLogout } from '../hooks/useAuth'
import { PageLoader } from '../components/Loader'
import { formatPrice, formatDate } from '../utils/format'


const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

const Account = () => {
  const dispatch = useDispatch()
  const logout = useLogout()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('orders')



  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
  })

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrders,
  })

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => dispatch(updateUser(data)),
  })

  const displayName = user?.full_name || user?.email || ''

  const tabClass = (tab) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === tab ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
    }`



  const inputClass = 'w-full border rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition'

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="border rounded-2xl p-6 h-fit bg-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-black text-white text-2xl font-bold rounded-full mx-auto flex items-center justify-center uppercase mb-2">
              {displayName[0] || 'C'}
            </div>
            <h3 className="font-bold text-lg">{displayName}</h3>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <button onClick={() => setActiveTab('orders')} className={tabClass('orders')}>
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>
              <Settings className="w-4 h-4" /> Accounts Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3 border rounded-2xl p-6 bg-white"
        >
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              {ordersLoading ? (
                <PageLoader />
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border rounded-xl p-4 text-sm">
                      <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
                        <div>
                          <p className="font-bold">Order #{ord.id}</p>
                          <p className="text-xs text-gray-500">{formatDate(ord.created_at)}</p>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[ord.status] || 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {ord.status}
                        </span>
                        <p className="font-bold">{formatPrice(ord.total_price)}</p>
                      </div>
                      <div className="border-t pt-3 space-y-1 text-gray-600">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.quantity} × {item.product_title} ({item.color_name} / {item.size})</span>
                            <span>{formatPrice(item.line_total)}</span>
                          </div>
                        ))}
                      </div>
                      {ord.shipping_info && (
                        <p className="text-xs text-gray-500 mt-3">Ship to: {ord.shipping_info}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
              {addrLoading ? (
                <PageLoader />
              ) : addresses.length === 0 ? (
                <p className="text-gray-500">No addresses yet. You can add one at checkout.</p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-xl p-4 text-sm">
                      <p className="font-bold">{addr.full_name} · {addr.phone_number}</p>
                      <p className="text-gray-600">
                        {addr.address_line}, {addr.city} {addr.postal_code}, {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
              <p className="text-xs text-gray-500 mb-6">Update your personal information below.</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  profileMutation.mutate(formData)
                }}
                className="space-y-4 max-w-lg"
              >
                <div>
                  <label className="text-xs font-bold block mb-1">Email</label>
                  <input type="email" value={user?.email || ''} disabled className={`${inputClass} bg-gray-100 text-gray-500`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {profileMutation.isError && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">
                    {profileMutation.error.message}
                  </p>
                )}
                {profileMutation.isSuccess && (
                  <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-2">
                    Profile updated successfully.
                  </p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
                >
                  {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Account