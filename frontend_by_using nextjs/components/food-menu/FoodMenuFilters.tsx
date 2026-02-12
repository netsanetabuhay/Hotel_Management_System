"use client"

import React from "react"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FoodMenuFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]  // This comes from your backend and includes ALL categories
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
  const clearCategory = () => onCategoryFilterChange('all')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Categories</SelectItem>
                {/* ✅ This shows ALL categories from your database */}
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-accent' : ''}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || categoryFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: "{search}"
                <button onClick={clearSearch} className="ml-1 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Category: {categoryFilter}
                <button onClick={clearCategory} className="ml-1 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}