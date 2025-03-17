"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sparkles } from "lucide-react"

interface AISearchRankingProps {
  relevanceScore: number
}

export default function AISearchRanking({ relevanceScore }: AISearchRankingProps) {
  if (relevanceScore < 85) {
    return null
  }

  let label = "Relevant"
  let colorClass = "bg-blue-100 text-blue-800 border-blue-200"

  if (relevanceScore >= 95) {
    label = "Highly Relevant"
    colorClass = "bg-purple-100 text-purple-800 border-purple-200"
  } else if (relevanceScore >= 90) {
    label = "Very Relevant"
    colorClass = "bg-indigo-100 text-indigo-800 border-indigo-200"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`flex items-center gap-1 ${colorClass}`}>
            <Sparkles className="h-3 w-3" />
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">AI determined this journal is {relevanceScore}% relevant to your search</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

