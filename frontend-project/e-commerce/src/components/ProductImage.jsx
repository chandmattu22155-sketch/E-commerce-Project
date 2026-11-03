import { ImageOff } from 'lucide-react'

const ProductImage = ({ src, alt, className = '' }) => {
  if (!src) {
    return (
      <div className={`flex items-center justify-center text-gray-900 ${className}`}>
        <ImageOff className="w-8 h-8" />
      </div>
    )
  }
  
  return <img src={src} alt={alt} className={className} />
}

export default ProductImage
