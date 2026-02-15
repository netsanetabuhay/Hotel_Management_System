"use client"

import React from "react"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FoodMenuFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]
}

export function FoodMenuFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: FoodMenuFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false)

  const clearSearch = () => onSearchChange('')

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-5">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white text-black"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-primary bg-white text-black">
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors text-black">
                  <span className="text-black font-medium">All Categories</span>
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors text-black"
                  >
                    <span className="text-black">{category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`hover:scale-105 transition-all border-gray-200 hover:border-primary bg-white ${
                showFilters ? 'bg-primary/10 border-primary text-primary' : 'text-black'
              }`}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}