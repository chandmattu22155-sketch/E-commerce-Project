import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, LogOut, Menu, X } from 'lucide-react'
// import { fetchCart } from '../services/cartService'
import { useLogout } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

const navClass = ({ isActive }) =>
  `text-md font-medium transition-colors ${
    isActive ? 'text-black' : 'text-gray-500 hover:text-black'
  }`

const mobileNavClass = ({ isActive }) =>
  `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

const Navbar = () => {
  
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const logout = useLogout()
  const [term, setTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)


  const { count: cartCount } = useCart() 

  const handleSearch = (e) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop')
    setMenuOpen(false)
  }

  const displayName = user?.first_name || user?.email || 'Account'

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black shrink-0"
          >
            Clothify
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navClass}>
              Shop
            </NavLink>

              <NavLink className={navClass}>
              On Sale
            </NavLink>
              <NavLink className={navClass}>
              Brands
            </NavLink>


          </nav>

          {/* Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm outline-none border border-transparent focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile search icon */}
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center font-bold shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth (desktop) */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-sm font-medium bg-gray-100 pl-1 pr-3 py-1 rounded-full hover:bg-gray-200 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase">
                    {displayName[0]}
                  </div>
                  <span className="hidden md:inline max-w-25 truncate">
                    {displayName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-3 py-1.5 text-gray-700 hover:text-black transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
                />
              </form>

              {/* Nav links */}
              <nav className="space-y-1">
                <NavLink
                  to="/"
                  end
                  className={mobileNavClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/shop"
                  className={mobileNavClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Shop
                </NavLink>
              </nav>

              {/* Auth mobile */}
              <div className="pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold uppercase">
                        {displayName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-black truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500">View account</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-sm font-medium bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar