import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductImage from './ProductImage'
import { formatPrice } from '../utils/format'
import { Star } from 'lucide-react'

const ProductCard = ({ product, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-[#f0eeed] rounded-xl aspect-square relative flex items-center justify-center overflow-hidden mb-3">
          {product.category_name && (
            <span className="absolute top-3 left-3 bg-white text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded border z-10">
              {product.category_name}
            </span>
          )}

          {/* Discount Percentage Badge */}
          {product.discount_percentage > 0 && (
            <span className="absolute top-3 right-3 bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
              -{product.discount_percentage}%
            </span>
          )}

          <ProductImage
            src={product.image}
            alt={product.title}
            className="object-cover rounded-xl h-full w-full group-hover:scale-105 transition-transform duration-400"
          />
        </div>

        <h3 className="font-bold text-base text-gray-900 truncate">{product.title}</h3>

        {/* Rating Display */}
        {product.average_rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-800">
              {product.average_rating}
            </span>
            <span className="text-xs text-gray-400">({product.reviews_count || 0})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-extrabold text-lg text-black">
            {formatPrice(product.final_price || product.price)}
          </span>
          
          {product.discount_price && product.discount_price < product.price && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {formatPrice(product.price)}
            </span>
          )}

          {product.stock === 0 && (
            <span className="text-xs text-red-500 font-semibold">Out of stock</span>
          )}
          {product.stock > 0 && product.stock <= 4 && (
            <span className="text-xs text-orange-500 font-semibold">Only {product.stock} left!</span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard