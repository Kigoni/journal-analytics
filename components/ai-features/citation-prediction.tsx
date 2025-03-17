"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Loader2 } from "lucide-react"
import { fetchRecommendedCitations } from "@/lib/ai-api"

interface CitationPredictionProps {
  journalId: string
}
interface Citation {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
}
export default function CitationPrediction({ journalId }: CitationPredictionProps) {
  const [recommendations, setRecommendations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true)
      try {
        const data = await fetchRecommendedCitations(journalId)
        setRecommendations(data)
      } catch (error) {
        console.error("Failed to fetch citation recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [journalId])

  if (recommendations.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          You May Also Like
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-purple-500 mt-1" />
                <div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.authors.join(", ")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-white">
                      {item.journal}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

