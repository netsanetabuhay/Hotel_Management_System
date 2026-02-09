"use client"

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (value: string | null) => void
  onUpload: (file: File) => Promise<string>
  disabled?: boolean
  className?: string
  uploadType?: 'food' | 'rooms'
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  className,
  uploadType = 'food'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only JPEG, PNG, GIF, or WebP images')
      return
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const imageUrl = await onUpload(file)
      onChange(imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image {uploadType === 'food' ? 'of Food Item' : 'of Room'}
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
          disabled={disabled || isUploading}
        />

        {value ? (
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            {!disabled && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            onClick={!disabled ? triggerFileInput : undefined}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5",
              error ? "border-red-300" : "border-gray-300"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}