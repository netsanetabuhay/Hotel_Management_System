"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Hotel, Calendar, Utensils, Package, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { searchApi, type SearchResult } from "@/lib/search"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const typeIcons = {
  room: Hotel,
  reservation: Calendar,
  food_order: Utensils,
  food_item: Package,
}

const typeColors = {
  room: "text-blue-600 bg-blue-100",
  reservation: "text-green-600 bg-green-100",
  food_order: "text-orange-600 bg-orange-100",
  food_item: "text-purple-600 bg-purple-100",
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const search = async () => {
      if (!query.trim() || !user || !token) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const searchResults = await searchApi.searchAll(query, user.user_id, token)
        setResults(searchResults)
      } catch (error) {
        console.error("Search failed:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query, user, token])

  const handleResultClick = (result: SearchResult) => {
    router.push(result.link)
    setQuery("")
    setShowResults(false)
    setResults([])
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && results.length > 0) {
      handleResultClick(results[0])
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search rooms, reservations, food orders, menu items..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-10 py-6 text-base rounded-full border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        <Button
          type="submit"
          variant="default"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full"
        >
          Search
        </Button>
      </form>

      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-2 text-sm">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Search Results ({results.length})
              </div>
              {results.map((result) => {
                const Icon = typeIcons[result.type]
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    className="w-full text-left px-3 py-3 hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-b-0"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={cn("p-2 rounded-lg", typeColors[result.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">
                          {result.title}
                        </span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", typeColors[result.type])}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                      {result.timestamp && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : query.trim() && !isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for rooms, reservations, or food items</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}