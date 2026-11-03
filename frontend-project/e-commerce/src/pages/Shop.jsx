import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Loader'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'

const PRODUCTS_PER_PAGE = 9

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', { category, search }],
    queryFn: () => fetchProducts({ category, search }),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  
  useEffect(() => {
    setCurrentPage(1)
  }, [category, search])

  const selectCategory = (id) => {
    const next = new URLSearchParams(searchParams)

    if (id) {
      next.set('category', id)
    } else {
      next.delete('category')
    }

    setSearchParams(next)
  }

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('search')
    setSearchParams(next)
  }

  const itemClass = (active) =>
    `w-full text-left px-3 py-2 rounded-lg text-sm transition ${
      active
        ? 'bg-black text-white font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
    }`

 
  const totalProducts = products.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)

  const currentProducts = products.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)

    if (currentPage <= 3) end = 5
    if (currentPage >= totalPages - 2) start = totalPages - 4

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-extrabold">
          {search ? `Results for "${search}"` : 'All Products'}
        </h1>

        <div className="flex items-center gap-3">
          {search && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
            >
              Clear search
              <X className="w-3 h-3" />
            </button>
          )}

          <span className="text-sm text-gray-500">
            {totalProducts} Products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category sidebar */}
        <aside className="border rounded-2xl p-5 h-fit bg-white">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h2 className="font-bold text-lg">Category</h2>
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-1">
            <button
              onClick={() => selectCategory('')}
              className={itemClass(!category)}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(String(cat.id))}
                className={itemClass(category === String(cat.id))}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <section className="md:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton
              count={9}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            />
          ) : isError ? (
            <p className="text-red-500">
              {error?.message || 'Failed to load products. Please try again.'}
            </p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">
              No products found.
            </p>
          ) : (
            <>
              {/* Results summary */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1}–{endIndex} of {totalProducts} products
                </p>
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentProducts.map((prod, i) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    index={i}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="flex flex-wrap items-center justify-center gap-2 mt-10"
                  aria-label="Product pagination"
                >
                  {/* Previous */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* First page and leading ellipsis */}
                  {totalPages > 7 && currentPage > 3 && (
                    <>
                      <button
                        onClick={() => goToPage(1)}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        1
                      </button>

                      {currentPage > 4 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}
                    </>
                  )}

                  {/* Page numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`min-w-10 rounded-lg border px-3 py-2 text-sm transition ${
                        currentPage === page
                          ? 'bg-black text-white border-black'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Trailing ellipsis and last page */}
                  {totalPages > 7 && currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}

                      <button
                        onClick={() => goToPage(totalPages)}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Shop
