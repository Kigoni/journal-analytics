"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { fetchAISuggestedFilters } from "@/lib/ai-api"

interface AISuggestedFiltersProps {
  query: string
  onApplyFilter: (filter: { category: string; value: string; label: string }) => void
}

export default function AISuggestedFilters({ query, onApplyFilter }: AISuggestedFiltersProps) {
  const [suggestedFilters, setSuggestedFilters] = useState<{ category: string; value: string; label: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadSuggestedFilters = async () => {
      if (!query || query.length < 3) {
        setSuggestedFilters([])
        return
      }

      setIsLoading(true)
      try {
        const data = await fetchAISuggestedFilters(query)
        setSuggestedFilters(data)
      } catch (error) {
        //.error("Failed to fetch AI suggested filters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSuggestedFilters()
  }, [query])

  if (suggestedFilters.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI-Suggested Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Based on your search for "<span className="font-medium">{query}</span>", we recommend:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedFilters.map((filter) => (
                <Badge
                  key={`${filter.category}-${filter.value}`}
                  variant="outline"
                  className="cursor-pointer bg-white hover:bg-purple-50 transition-colors flex items-center gap-1 py-1.5"
                  onClick={() => onApplyFilter(filter)}
                >
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  {filter.label}: {filter.value}
                </Badge>
              ))}
            </div>
            <div className="pt-2">
              <Button
                variant="link"
                size="sm"
                className="text-xs text-purple-600 p-0 h-auto"
                onClick={() => setSuggestedFilters([])}
              >
                Dismiss suggestions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

