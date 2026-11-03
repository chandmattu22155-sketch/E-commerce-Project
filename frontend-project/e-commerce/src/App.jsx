import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'



const NotFound = () => (
  <div className="text-center py-24">
    <h1 className="text-5xl font-black mb-3">404</h1>
    <p className="text-gray-500 mb-6">Page not found.</p>
    <Link to="/" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium">
      Go Home
    </Link>
  </div>
)

const page = (element) => <PageTransition>{element}</PageTransition>

function App() {

  const location = useLocation()

 
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={page(<Home />)} />
            <Route path="/shop" element={page(<Shop />)} />
            <Route path="/cart" element={page(<Cart />)} />
            <Route path="/product/:id" element={page(<ProductDetail />)} />

           
            <Route element={<ProtectedRoute />}>
              <Route path="/order-success" element={page(<OrderSuccess />)} />
              <Route path="/account" element={page(<Account />)} />
            </Route>

       
            <Route element={<GuestRoute />}>
              <Route path="/login" element={page(<Login />)} />
              <Route path="/register" element={page(<Register />)} />
            </Route>

            <Route path="*" element={page(<NotFound />)} />
          </Routes>
        </AnimatePresence>  
      </main>
      <Footer />
    </div>
  )
}

export default App