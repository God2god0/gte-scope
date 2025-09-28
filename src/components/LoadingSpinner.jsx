import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', text = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20"></div>
      </div>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )
}

export default LoadingSpinner
