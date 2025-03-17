"use client"

import { useState } from "react"
import JournalSearch from "@/components/journal-search"
import { Hero } from "@/components/hero"
import AdvancedSearchBar from "@/components/advanced-search-bar"
import SubmitJournalDialog from "@/components/submit-journal-dialog"
import AIResearchAssistant from "@/components/ai-research-assistant"

export default function Home() {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [searchParams, setSearchParams] = useState({
    query: "",
    type: "keyword",
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string, type: string) => {
    setSearchParams({ query, type })
    // Additional search logic would go here
  }

  const handleFilterClick = () => {
    setShowFilters(!showFilters)
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-yellow-300/20 to-green-300/20">
      <Hero totalJournals={1250} />
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-6">
          <AdvancedSearchBar
          initialQuery={searchParams.query} searchType={searchParams.type} showFilters={showFilters} 
          />

          {/* <JournalSearch initialQuery={searchParams.query} searchType={searchParams.type} showFilters={showFilters} /> */}
        </div>

        <SubmitJournalDialog open={showSubmitDialog} onOpenChange={() => setShowSubmitDialog(!showSubmitDialog)} />

<AIResearchAssistant open={showAIAssistant} onOpenChange={() => setShowAIAssistant(!showAIAssistant)} />

        {/* Floating AI Assistant Button */}
        <button
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Open AI Research Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
        </button>
      </div>
    </main>
  )
}

