import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import { fetchProductDetail } from '../services/productService'
import { addToCart } from '../services/cartService'
import ProductImage from '../components/ProductImage'
import { PageLoader } from '../components/Loader'
import { formatPrice } from '../utils/format'
import { addGuestItem } from '../utils/guestCart'

const ProductDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [formError, setFormError] = useState('')

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetail(id),
  })

  const variants = product?.variants ?? []
  const selectedVariant =
    variants.find((v) => v.color_name === selectedColor && v.size === selectedSize) || null
  const availableStock = selectedVariant?.stock ?? 0
  const outOfStock = availableStock === 0

  // Product aate hi image aur pehla available variant chun lo
  useEffect(() => {
    if (!product) return
    const images = product.images ?? []
    const main = images.find((img) => img.is_main) || images[0]
    setSelectedImage(main?.image || product.image || '')

    const first = (product.variants ?? []).find((v) => v.stock > 0) || product.variants?.[0]
    setSelectedColor(first?.color_name ?? null)
    setSelectedSize(first?.size ?? null)
    setQty(1)
    setAdded(false)
    setFormError('')
  }, [product])

  // Variant badle to quantity stock se zyada na ho
  useEffect(() => {
    setQty((q) => Math.max(1, Math.min(q, availableStock || 1)))
  }, [availableStock])

  const cartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      setAdded(true)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  if (isLoading) return <PageLoader text="Loading product..." />
  if (isError || !product) return <p className="text-center py-20">Product not found!</p>

  const colors = []
  variants.forEach((v) => {
    if (!colors.find((c) => c.name === v.color_name)) {
      colors.push({ name: v.color_name, code: v.color_code })
    }
  })
  const sizeOptions = variants.filter((v) => v.color_name === selectedColor)

  const chooseColor = (name) => {
    setSelectedColor(name)
    const options = variants.filter((v) => v.color_name === name)
    const keep = options.find((v) => v.size === selectedSize && v.stock > 0)
    const next = keep || options.find((v) => v.stock > 0) || options[0]
    setSelectedSize(next?.size ?? null)
    setAdded(false)
    setFormError('')
  }

  const chooseSize = (size) => {
    setSelectedSize(size)
    setAdded(false)
    setFormError('')
  }

  const handleAdd = () => {
    setAdded(false)
    if (!selectedVariant) {
      setFormError('Please select a color and size.')
      return
    }
    setFormError('')

    if (!isAuthenticated) {
      try {
        addGuestItem(product, selectedVariant, qty)
        setAdded(true)
      } catch (err) {
        setFormError(err.message)
      }
      return
    }
    cartMutation.mutate({ variantId: selectedVariant.id, quantity: qty })
  }

  const errorText = formError || (cartMutation.isError ? cartMutation.error.message : '')

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {product.images && product.images.length > 0 && (
            <div className="flex md:flex-col gap-3 justify-between md:justify-start">
              {product.images.slice(0, 4).map((imgObj) => (
                <div
                  key={imgObj.id}
                  onClick={() => setSelectedImage(imgObj.image)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#f0eeed] cursor-pointer overflow-hidden border-2 transition-all ${
                    selectedImage === imgObj.image ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img src={imgObj.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 bg-[#f0eeed] rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
            <ProductImage
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {product.category_name}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black uppercase">{product.title}</h1>

          {Number(product.average_rating) > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(Number(product.average_rating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {product.average_rating}/<span className="text-gray-400">5</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold text-black">
              {formatPrice(product.final_price || product.price)}
            </span>
            {Number(product.final_price) < Number(product.price) && (
              <span className="text-2xl font-bold text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className="bg-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed border-b border-gray-200 pb-5">
            {product.description || 'No description available.'}
          </p>

          {colors.length > 0 && (
            <div className="border-b border-gray-200 pb-5">
              <span className="text-sm text-gray-500 block mb-3">Select Colors</span>
              <div className="flex gap-3">
                {colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => chooseColor(col.name)}
                    style={{ backgroundColor: col.code }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform ${
                      selectedColor === col.name
                        ? 'ring-2 ring-offset-2 ring-black scale-105'
                        : 'border border-gray-300'
                    }`}
                    title={col.name}
                  >
                    {selectedColor === col.name && '✓'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizeOptions.length > 0 && (
            <div className="border-b border-gray-200 pb-5">
              <span className="text-sm text-gray-500 block mb-3">Choose Size</span>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => chooseSize(v.size)}
                    disabled={v.stock === 0}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:line-through ${
                      selectedSize === v.size
                        ? 'bg-black text-white'
                        : 'bg-[#f0eeed] text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            {variants.length === 0 ? (
              <p className="text-sm text-red-500 font-semibold mb-2">Currently unavailable</p>
            ) : outOfStock ? (
              <p className="text-sm text-red-500 font-semibold mb-2">Out of stock</p>
            ) : availableStock <= 4 ? (
              <p className="text-sm text-orange-500 font-semibold mb-2">Only {availableStock} left!</p>
            ) : (
              <p className="text-sm text-green-600 font-semibold mb-2">In stock</p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-[#f0eeed] rounded-full px-4 py-3 gap-6">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={outOfStock}
                className="disabled:opacity-40"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold text-base w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(availableStock, qty + 1))}
                disabled={outOfStock || qty >= availableStock}
                className="disabled:opacity-40"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={cartMutation.isPending || outOfStock}
              className="flex-1 bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {outOfStock ? 'Out of Stock' : cartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </motion.button>
          </div>

          {errorText && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{errorText}</p>
          )}
          {added && (
            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-2">
              Added to cart.{' '}
              <Link to="/cart" className="underline font-bold">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail