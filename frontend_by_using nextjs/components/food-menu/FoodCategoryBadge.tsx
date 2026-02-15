"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface FoodCategoryBadgeProps {
  category: string
  onClick?: () => void
  isClickable?: boolean
}

const categoryColors: Record<string, { bg: string, text: string, hover: string }> = {
  appetizer: { bg: "bg-blue-50", text: "text-blue-700", hover: "hover:bg-blue-100 hover:text-blue-800" },
  "main course": { bg: "bg-emerald-50", text: "text-emerald-700", hover: "hover:bg-emerald-100 hover:text-emerald-800" },
  "main": { bg: "bg-emerald-50", text: "text-emerald-700", hover: "hover:bg-emerald-100 hover:text-emerald-800" },
  dessert: { bg: "bg-purple-50", text: "text-purple-700", hover: "hover:bg-purple-100 hover:text-purple-800" },
  beverage: { bg: "bg-amber-50", text: "text-amber-700", hover: "hover:bg-amber-100 hover:text-amber-800" },
  "side dish": { bg: "bg-gray-50", text: "text-gray-700", hover: "hover:bg-gray-100 hover:text-gray-800" },
  side: { bg: "bg-gray-50", text: "text-gray-700", hover: "hover:bg-gray-100 hover:text-gray-800" },
  soup: { bg: "bg-orange-50", text: "text-orange-700", hover: "hover:bg-orange-100 hover:text-orange-800" },
  salad: { bg: "bg-lime-50", text: "text-lime-700", hover: "hover:bg-lime-100 hover:text-lime-800" },
  breakfast: { bg: "bg-yellow-50", text: "text-yellow-700", hover: "hover:bg-yellow-100 hover:text-yellow-800" },
  seafood: { bg: "bg-cyan-50", text: "text-cyan-700", hover: "hover:bg-cyan-100 hover:text-cyan-800" },
  vegetarian: { bg: "bg-green-50", text: "text-green-700", hover: "hover:bg-green-100 hover:text-green-800" },
  vegan: { bg: "bg-teal-50", text: "text-teal-700", hover: "hover:bg-teal-100 hover:text-teal-800" },
  "kids menu": { bg: "bg-pink-50", text: "text-pink-700", hover: "hover:bg-pink-100 hover:text-pink-800" },
}

export function FoodCategoryBadge({ category, onClick, isClickable = false }: FoodCategoryBadgeProps) {
  const normalizedCategory = category.toLowerCase()
  const colors = categoryColors[normalizedCategory] || { 
    bg: "bg-gray-50", 
    text: "text-gray-700", 
    hover: "hover:bg-gray-100 hover:text-gray-800" 
  }
  
  const baseClasses = `
    ${colors.bg} 
    ${colors.text} 
    px-3 
    py-1 
    rounded-full 
    text-sm 
    font-medium 
    border 
    border-transparent
    transition-all 
    duration-200
    inline-flex
    items-center
    justify-center
    shadow-sm
  `

  const clickableClasses = isClickable || onClick
    ? `
      ${colors.hover}
      hover:border-blue-300
      hover:shadow-md
      hover:scale-105
      cursor-pointer
      focus:outline-none
      focus:ring-2
      focus:ring-blue-300
      focus:ring-offset-1
      active:scale-95
    `
    : ''

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation()
      onClick()
    }
  }

  if (onClick || isClickable) {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${clickableClasses}`}
        title={`Click to see all ${category} items`}
      >
        {category}
      </button>
    )
  }

  return (
    <Badge className={`${baseClasses} ${clickableClasses}`} variant="secondary">
      {category}
    </Badge>
  )
}