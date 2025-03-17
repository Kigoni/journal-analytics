"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Search, BookOpen, FileText, Download, Send, Loader2 } from "lucide-react"

interface AIResearchAssistantProps {
  open: boolean;
  onOpenChange: () => void;
}


export default function AIResearchAssistant({ open, onOpenChange}: AIResearchAssistantProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("assistant")

  // Mock research recommendations
  const recommendations = [
    {
      title: "Recent advances in climate-resilient agriculture in East Africa",
      journals: ["Journal of Agricultural Research in Africa", "East African Agricultural Review"],
      relevance: 98,
    },
    {
      title: "Comparative analysis of healthcare systems across Sub-Saharan Africa",
      journals: ["African Journal of Medical Sciences", "Health Policy and Planning"],
      relevance: 92,
    },
    {
      title: "Educational technology adoption in rural African schools",
      journals: ["West African Journal of Education", "International Journal of Educational Technology"],
      relevance: 87,
    },
  ]

  // Mock journal recommendations
  const journalRecommendations = [
    {
      title: "African Journal of Environmental Science",
      match: "95% match to your research interests",
      reason: "Based on your reading history and publication record",
    },
    {
      title: "Journal of African Economics",
      match: "92% match to your research interests",
      reason: "Based on your citation patterns and saved articles",
    },
    {
      title: "African Studies Review",
      match: "88% match to your research interests",
      reason: "Based on your profile keywords and recent searches",
    },
  ]

  const handleSubmit = async (e: React.SyntheticEvent) => {

    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    // Simulate API call to AI research assistant
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // In a real implementation, you would process the response here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Research Assistant
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="assistant" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
            <TabsTrigger value="topics">Research Topics</TabsTrigger>
            <TabsTrigger value="journals">Journal Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="assistant" className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                Ask me anything about African academic journals, research topics, or scholarly trends. I can help you
                find relevant journals, suggest research topics, or explain academic concepts.
              </p>
            </div>

            <div className="space-y-4 min-h-[300px]">
              <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none w-4/5">
                <p className="text-sm">
                  Hello! I'm your AI research assistant. I can help you discover relevant journals, find research
                  topics, and navigate the academic landscape. What would you like to know today?
                </p>
              </div>

              {/* This would be populated with actual conversation in a real implementation */}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                placeholder="Ask about journals, research topics, or academic trends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">AI-Recommended Research Topics</h3>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {rec.relevance}% match
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Recommended journals: {rec.journals.join(", ")}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-3 w-3 mr-1" />
                      Explore
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="journals" className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Personalized Journal Recommendations</h3>
            </div>

            <div className="space-y-4">
              {journalRecommendations.map((journal, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{journal.title}</h4>
                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{journal.match}</div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <p className="text-xs text-muted-foreground">{journal.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      View Journal
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Follow
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
        <Button variant="outline" onClick={onOpenChange}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

