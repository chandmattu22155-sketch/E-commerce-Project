import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-200">
          {/* Brand + About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-black text-black mb-4 tracking-tight">
              Clothify
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 max-w-xs">
              Clothes that suit your style and which you're proud to wear.
              Premium quality, timeless designs.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-white hover:bg-black hover:border-black transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-white hover:bg-black hover:border-black transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-white hover:bg-black hover:border-black transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm text-black mb-4 tracking-wider uppercase">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=men" className="hover:text-black transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-black transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop?category=new" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=true" className="hover:text-black transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm text-black mb-4 tracking-wider uppercase">
              Help
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/contact" className="hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-black transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-black transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-black transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Account + Contact */}
          <div>
            <h4 className="font-bold text-sm text-black mb-4 tracking-wider uppercase">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-5">
              <li>
                <Link to="/account" className="hover:text-black transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-black transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-black transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>

            <h4 className="font-bold text-sm text-black mb-3 tracking-wider uppercase">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@clothify.com" className="hover:text-black transition-colors">
                  support@clothify.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+923001234567" className="hover:text-black transition-colors">
                  +92 300 1234567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 font-medium">
            Secure payments powered by trusted providers
          </p>
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'PayPal', 'COD'].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-white border border-gray-200 rounded-md"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Clothify © 2024–2026, All Rights Reserved
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-black transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-black transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-black transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer