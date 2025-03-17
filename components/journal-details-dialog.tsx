"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ExternalLink, BookOpen, Clock, Globe, FileText } from "lucide-react"
import { fetchSimilarJournals } from "@/lib/api"
import JournalVolumes from "@/components/journal-volumes"



export default function JournalDetailsDialog({ journal, open, onOpenChange }: { journal: any, open: boolean, onOpenChange: (open: boolean) => void }) {

  const [similarJournals, setSimilarJournals] = useState<
  {
    id: string;
    title: string;
    publisher: string;
    country: string;
    description: string;
    indexing: string[];
  }[]
>([]);
const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open && journal) {
      const loadSimilarJournals = async () => {
        setIsLoading(true)
        try {
          const data = await fetchSimilarJournals(journal.id)
          setSimilarJournals(data)
        } catch (error) {
          console.error("Failed to fetch similar journals:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadSimilarJournals()
    }
  }, [open, journal])

  if (!journal) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <BaseDialogHeader>
          <BaseDialogTitle className="flex items-start justify-between">
            <span>{journal.title}</span>
            {journal.isAIRecommended && (
              <Badge variant="outline" className="flex items-center gap-1 ml-2">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                AI Recommended
              </Badge>
            )}
          </BaseDialogTitle>
        </BaseDialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="volumes">Volumes & Articles</TabsTrigger>
            <TabsTrigger value="similar">Similar Journals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">About</h3>
              <p className="text-muted-foreground">{journal.description}</p>
            </div>

            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-medium">Journal Cover</h3>
              {journal.coverImage ? (
                <div className="flex justify-center">
                  <img
                    src={journal.coverImage || "/placeholder.svg"}
                    alt={`${journal.title} cover`}
                    className="max-h-64 object-contain rounded-md shadow-md"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-40 bg-muted rounded-md">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">No cover image available</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Publisher</h3>
                <p>{journal.publisher}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Country</h3>
                <p>{journal.country}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">ISSN</h3>
                <p>{journal.issn || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">E-ISSN</h3>
                <p>{journal.eissn || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Indexing</h3>
              <div className="flex flex-wrap gap-2">
                {journal.indexing &&
                  journal.indexing.map((index: string) => (

                    <Badge key={index} variant="secondary">
                      {index}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">AI-Generated Summary</h3>
              <div className="bg-primary/5 p-4 rounded-md border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">AI Analysis</span>
                </div>
                <p className="text-sm">
                  {journal.aiSummary ||
                    "This journal focuses on publishing research in the field of " +
                      journal.thematicArea +
                      ". It has been active since " +
                      (journal.foundedYear || "several years") +
                      " and publishes articles primarily in " +
                      (journal.language || "English") +
                      ". The journal is indexed in " +
                      (journal.indexing ? journal.indexing.join(", ") : "various databases") +
                      " and maintains a rigorous peer-review process."}
                </p>
              </div>
            </div>

            <Button className="w-full" asChild>
              <a href={journal.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Journal Website
              </a>
            </Button>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Publication Frequency</h3>
                </div>
                <p className="text-sm text-muted-foreground">{journal.frequency || "Quarterly"}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Languages</h3>
                </div>
                <p className="text-sm text-muted-foreground">{journal.language || "English"}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Article Types</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {journal.articleTypes || "Original Research, Review Articles, Case Studies"}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Thematic Areas</h3>
                </div>
                <p className="text-sm text-muted-foreground">{journal.thematicArea || "Medicine, Health Sciences"}</p>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Editorial Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Editor-in-Chief</h4>
                  <p className="text-sm text-muted-foreground">{journal.editorInChief || "Prof. John Doe"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Editorial Board</h4>
                  <p className="text-sm text-muted-foreground">
                    {journal.editorialBoard ||
                      "The journal has an international editorial board comprising experts from various countries and institutions."}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Peer Review Process</h4>
                  <p className="text-sm text-muted-foreground">
                    {journal.peerReviewProcess ||
                      "Double-blind peer review process with at least two independent reviewers."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Publication Ethics</h3>
              <p className="text-sm text-muted-foreground">
                {journal.ethics ||
                  "This journal adheres to the highest standards of publication ethics and takes measures to prevent publication malpractice. All submitted manuscripts are subject to initial appraisal by the Editor, and, if found suitable for further consideration, to peer review by independent, anonymous expert referees."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="volumes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Volumes & Articles</h3>
              <p className="text-muted-foreground mb-4">
                Browse through volumes and articles published in this journal.
              </p>

              <JournalVolumes journalId={journal.id} />
            </div>
          </TabsContent>

          <TabsContent value="similar" className="space-y-4 pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              AI-Recommended Similar Journals
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Based on thematic area, indexing, and content analysis</p>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarJournals.map((similar) => (
                  <Card key={similar.id} className="p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium mb-2">{similar.title}</h4>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {similar.indexing &&
                        similar.indexing.slice(0, 3).map((index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {index}
                          </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{similar.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{similar.publisher}</span>
                      <span>{similar.country}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

