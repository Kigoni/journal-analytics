"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  User,
} from "lucide-react";
import { fetchJournalVolumes } from "@/lib/api";

export default function JournalVolumes({ journalId }: { journalId: number }) {
  const [volumes, setVolumes] = useState<
    { id: string; number: number; year: number; articles: any[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVolumes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJournalVolumes(journalId);
        setVolumes(data);
      } catch (error) {
        //.error("Failed to fetch journal volumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVolumes();
  }, [journalId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (volumes.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No volumes available</h3>
        <p className="text-muted-foreground">
          This journal has no published volumes yet.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {volumes.map((volume) => (
        <AccordionItem key={volume.id} value={volume.id}>
          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
              <div className="font-medium">
                Volume {volume.number} ({volume.year})
              </div>
              <div className="text-sm text-muted-foreground">
                {volume.articles.length} Articles
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2 pl-4">
              {volume.articles.map((article) => (
                <Card
                  key={article.id}
                  className="p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <h4 className="font-medium">{article.title}</h4>
                      <Badge variant="outline" className="w-fit">
                        {article.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {article.abstract}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{article.authors.join(", ")}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Published: {article.publishedDate}</span>
                      </div>
                      {article.doi && (
                        <div>
                          <span className="font-medium">DOI:</span>{" "}
                          {article.doi}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={article.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View PDF
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={article.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                      {article.supplementaryUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={article.supplementaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Supplementary Materials
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
