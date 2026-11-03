import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Truck, ShoppingBag } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Loader'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }


const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1.5, -1.5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const Home = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', { category: '', search: '' }],
    queryFn: () => fetchProducts(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  return (
    <div>
      <section className="relative overflow-hidden bg-[#f2f0f1] py-16 md:py-24 px-4 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-black leading-[1.08] mb-4 max-w-2xl tracking-tight"
            >
              FIND CLOTHES THAT <span className="underline underline-offset-8 decoration-gray-400">MATCH</span> YOUR STYLE
            </motion.h1>

            <motion.p variants={item} className="text-gray-600 text-sm md:text-base mb-8 max-w-md leading-relaxed">
              Browse through our range of carefully chosen garments, designed to bring out your individuality and cater to your sense of style.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 items-center w-full sm:w-auto mb-10">
              <Link
                to="/shop"
                className="w-full sm:w-auto text-center bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2.5 shadow-lg shadow-black/10"
              >
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </Link>
            </motion.div>

            {/* Added: 3 Stats counters below Shop Now (Image ke mutabiq) */}
            <motion.div variants={item} className="grid grid-cols-3 gap-6 sm:gap-8 w-full pt-4 border-t border-gray-300/60 max-w-lg">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">200+</h3>
                <p className="text-xs sm:text-sm text-gray-600">International Brands</p>
              </div>
              <div className="border-x border-gray-300 px-4 sm:px-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">2,000+</h3>
                <p className="text-xs sm:text-sm text-gray-600">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">30,000+</h3>
                <p className="text-xs sm:text-sm text-gray-600">Happy Customers</p>
              </div>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative h-95 md:h-115 w-full flex items-center justify-center"
          >
            <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl relative">
              <img
                src="/hero.jpg"
                alt="Fashion Couple"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            <motion.div
              variants={floatingAnimation}
              animate="animate"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-white/50 px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 z-20"
            >
              <div className="bg-black text-white p-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-black">100% Original</p>
                <p className="text-[9px] text-gray-500">Premium Quality</p>
              </div>
            </motion.div>

            <motion.div
              variants={floatingAnimation}
              animate="animate"
              style={{ animationDelay: '1.5s' }}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 z-20"
            >
              <div className="bg-black text-white p-1.5 rounded-xl">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-black">Fast Shipping</p>
                <p className="text-[9px] text-gray-500">Secure Delivery</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* Added: Black Brands Bar at the bottom (Image ke mutabiq) */}
     
<section className="overflow-hidden bg-black py-8">
  <div className="flex w-max animate-[marquee_10s_linear_infinite]">
    {[1, 2].map((group) => (
      <div
        key={group}
        className="flex shrink-0 items-center gap-12 px-6 md:gap-20"
      >
        <span className="whitespace-nowrap font-serif text-2xl font-bold tracking-wider text-white md:text-3xl">
          VERSACE
        </span>

        <span className="whitespace-nowrap text-2xl font-bold tracking-widest text-white md:text-3xl">
          ZARA
        </span>

        <span className="whitespace-nowrap font-serif text-2xl font-bold tracking-wider text-white md:text-3xl">
          GUCCI
        </span>

        <span className="whitespace-nowrap text-2xl font-bold tracking-widest text-white md:text-3xl">
          PRADA
        </span>

        <span className="whitespace-nowrap text-2xl font-bold tracking-wider text-white md:text-3xl">
          Calvin Klein
        </span>
      </div>
    ))}
  </div>
</section>


      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-10">NEW ARRIVALS</h2>
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-block border border-gray-300 px-8 py-2.5 rounded-full font-medium hover:bg-black hover:text-white transition text-sm"
          >
            View All →
          </Link>
        </div>
      </section>

      {/* Browse By Category Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-[#f0eeed] rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-extrabold text-center mb-10">
              BROWSE BY CATEGORY
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="relative overflow-hidden bg-white rounded-xl h-48 md:h-64 shadow-sm flex items-end hover:shadow-md transition group"
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                    <h3 className="relative z-10 p-6 text-white font-bold text-2xl">
                      {cat.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

export default Home