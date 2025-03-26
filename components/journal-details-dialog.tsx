"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  Clock,
  Globe,
  FileText,
} from "lucide-react";
import { fetchSimilarJournals } from "@/lib/api";
import JournalVolumes from "@/components/journal-volumes";
import { Journal } from "@/data/journalData";
import MarkdownStyler from "./custom/markdownstyler";

export default function JournalDetailsDialog({
  journal,
  open,
  onOpenChange,
}: {
  journal: Journal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [similarJournals, setSimilarJournals] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open && journal) {
      const loadSimilarJournals = async () => {
        setIsLoading(true);
        try {
          const data = await fetchSimilarJournals(journal.summary);
          setSimilarJournals(data);
        } catch (error) {
          //.error("Failed to fetch similar journals:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadSimilarJournals();
    }
  }, [open, journal]);

  if (!journal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <BaseDialogHeader>
          <BaseDialogTitle className="flex items-start justify-between">
            <span>{journal.journal_title}</span>
            <Badge variant="outline" className="flex items-center gap-1 ml-2">
              <Sparkles className="h-3 w-3 text-yellow-500" />
              AI Recommended
            </Badge>
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
              <p className="text-muted-foreground">{journal.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Publisher</h3>
                <p>{journal.publishers_name}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Country</h3>
                <p>{journal.country.country}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">ISSN</h3>
                <p>{journal.issn_number || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">E-ISSN</h3>
                <p>{journal.articles[0]?.electronic_issn || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Indexing</h3>
              <div className="flex flex-wrap gap-2">
                {journal.google_scholar_index && (
                  <Badge variant="secondary">Google Scholar Index</Badge>
                )}
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
                  {"This journal focuses on publishing research in the field of " +
                    journal.thematic_area.thematic_area +
                    ". It has been active since " +
                    (journal.language || "English") +
                    ". The journal is indexed in " +
                    " and maintains a rigorous peer-review process."}
                </p>
              </div>
            </div>

            <a
              href={journal.link}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Journal Website
            </a>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Publication Frequency</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {journal.articles[0]?.reference_count || "Quarterly"}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Languages</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {journal.language.language || "English"}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Article Types</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {journal.articles[0]?.article_type ||
                    "Original Research, Review Articles, Case Studies"}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Thematic Areas</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {journal.thematic_area.thematic_area ||
                    "Medicine, Health Sciences"}
                </p>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Editorial Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Editor-in-Chief</h4>
                  <p className="text-sm text-muted-foreground">
                    {journal.articles[0]?.authors || "Prof. John Doe"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Editorial Board</h4>
                  <p className="text-sm text-muted-foreground">
                    {
                      "The journal has an international editorial board comprising experts from various countries and institutions."
                    }
                  </p>
                </div>
                {/* <div>
                  <h4 className="text-sm font-medium">Peer Review Process</h4>
                  <p className="text-sm text-muted-foreground">
                    {journal.peerReviewProcess ||
                      "Double-blind peer review process with at least two independent reviewers."}
                  </p>
                </div> */}
              </div>
            </div>

            {/* <div className="space-y-2">
              <h3 className="text-lg font-medium">Publication Ethics</h3>
              <p className="text-sm text-muted-foreground">
                {journal.ethics ||
                  "This journal adheres to the highest standards of publication ethics and takes measures to prevent publication malpractice. All submitted manuscripts are subject to initial appraisal by the Editor, and, if found suitable for further consideration, to peer review by independent, anonymous expert referees."}
              </p>
            </div> */}
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
            <p className="text-sm text-muted-foreground mb-4">
              Based on thematic area, indexing, and content analysis
            </p>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <MarkdownStyler content={similarJournals} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
