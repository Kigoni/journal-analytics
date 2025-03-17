"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, BookOpen, FileText, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import JournalDetailsDialog from "@/components/journal-details-dialog"
import CitationsDialog from "@/components/citations-dialog"
import AISearchRanking from "@/components/ai-features/ai-search-ranking"
import AISummarization from "@/components/ai-features/ai-summarization"
import CitationPrediction from "@/components/ai-features/citation-prediction"

interface JournalListProps {
  journals: any[]
  itemsPerPage?: number
}

export default function JournalList({ journals, itemsPerPage = 10 }: JournalListProps) {
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCitations, setShowCitations] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination logic
  const totalJournals = journals?.length || 0
  const totalPages = Math.ceil(totalJournals / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalJournals)
  const currentJournals = journals?.slice(startIndex, endIndex) || []

  const handleViewDetails = (journal: any) => {
    setSelectedJournal(journal)
    setShowDetails(true)
  }
  
  const handleViewCitations = (journal: any) => {
    setSelectedJournal(journal)
    setShowCitations(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of journal list
    document.getElementById("journal-list-top")?.scrollIntoView({ behavior: "smooth" })
  }

  if (!journals || journals.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No journals found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" id="journal-list-top">
      {/* Journal Cards - Full Width */}
      <div className="space-y-4">
        {currentJournals.map((journal) => {
          // Generate a relevance score for AI search ranking (in a real app, this would come from the API)
          const relevanceScore = journal.isAIRecommended
            ? Math.floor(Math.random() * 10) + 90
            : // 90-99 for AI recommended
              Math.floor(Math.random() * 30) + 70 // 70-99 for others

          return (
            <Card key={journal.id} className="w-full bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <CardTitle className="text-xl font-semibold">{journal.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <AISearchRanking relevanceScore={relevanceScore} />
                    {journal.isAIRecommended && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-yellow-500" />
                        AI Recommended
                      </Badge>
                    )}
                    {journal.indexing &&
  journal.indexing.map((index: string) => (
    <Badge key={index} variant="secondary" className="text-xs">
      {index}
    </Badge>
  ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <p className="text-muted-foreground mb-4">{journal.description}</p>

                    {/* AI Summarization */}
                    <AISummarization journalId={journal.id} description={journal.description} />

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Publisher:</span> {journal.publisher}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Country:</span> {journal.country}
                      </div>
                      {journal.issn && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">ISSN:</span> {journal.issn}
                        </div>
                      )}
                      {journal.thematicArea && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Field:</span> {journal.thematicArea}
                        </div>
                      )}
                      {journal.citationCount && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Citations:</span> {journal.citationCount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row md:flex-col flex-warp  gap-2">
                      <Button className="w-full"  onClick={() => handleViewDetails(journal)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="max-[450px]:hidden inline">Details</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full" 
                        onClick={() => {
                          handleViewDetails(journal)
                          // Set the active tab to volumes after opening the dialog
                          setTimeout(() => {
                            const volumesTab = document.querySelector('[value="volumes"]')
                            if (volumesTab) {
                              ;(volumesTab as HTMLElement).click()
                            }
                          }, 100)
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="max-[450px]:hidden inline">Volumes</span>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => handleViewCitations(journal)}>
                        <Quote className="h-4 w-4 mr-2" />
                        <span className="max-[450px]:hidden inline">Citations</span>
                      </Button>
                    </div>

                    {/* Citation Prediction - "You may also like" */}
                    <CitationPrediction journalId={journal.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Simplified Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalJournals}</span>{" "}
            journals
          </div>

          <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="border border-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* First two pages */}
            {[1, 2].map((page) => {
              if (page <= Math.max(totalPages, 3)) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 border border-gray-300"
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                )
              }
              return null
            })}

            {/* Ellipsis (always shown for demo) */}
            <span className="px-2 text-muted-foreground">...</span>

            {/* Last page (if not already shown) */}
            <Button
              variant={currentPage === Math.max(totalPages, 3) ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0 border border-gray-300"
              onClick={() => handlePageChange(Math.max(totalPages, 3))}
              aria-label={`Page ${Math.max(totalPages, 3)}`}
              aria-current={currentPage === Math.max(totalPages, 3) ? "page" : undefined}
            >
              {Math.max(totalPages, 3)}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.max(totalPages, 3)}
              aria-label="Next page"
              className="border border-gray-300"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {selectedJournal && (
        <>
          <JournalDetailsDialog journal={selectedJournal} open={showDetails} onOpenChange={setShowDetails} />
          <CitationsDialog journal={selectedJournal} open={showCitations} onOpenChange={setShowCitations} />
        </>
      )}
    </div>
  )
}

