export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
    <p className="text-sm">{text}</p>
  </div>
)

export const ProductGridSkeleton = ({ count = 8, className = 'grid grid-cols-2 md:grid-cols-4 gap-6' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 rounded-2xl aspect-square mb-3" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    ))}
  </div>
)

