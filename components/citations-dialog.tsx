"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Quote } from "lucide-react";

type OnOpenChangeCallback = (isOpen: boolean) => void;

interface Citation {
  id: string;
  title: string;
  author: string;
  year: number;
  source: string;
  context: string;
}

interface CitationsDialogProps {
  journal: { title: string };
  open: boolean;
  onOpenChange: OnOpenChangeCallback;
}

export default function CitationsDialog({ journal, open, onOpenChange }: CitationsDialogProps) {
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);

  // Mock citation data - in a real app, this would come from an API
  const citations: Citation[] = [
    {
      id: "cite-1",
      title: "The Role of African Journals in Global Knowledge Dissemination",
      author: "Amina Osei",
      year: 2023,
      source: "Journal of Scholarly Communication",
      context:
        "This study highlights the increasing importance of African journals in contributing to global research and knowledge sharing.",
    },
    {
      id: "cite-2",
      title: "Open Access Publishing in Sub-Saharan Africa: Challenges and Opportunities",
      author: "Robert Mwangi",
      year: 2022,
      source: "Open Access Journal",
      context:
        "This paper explores the challenges and opportunities associated with open access publishing in the context of Sub-Saharan Africa.",
    },
    {
      id: "cite-3",
      title: "Citation Analysis of African Medical Journals: A Comparative Study",
      author: "Elizabeth Muthoni",
      year: 2021,
      source: "Scientometrics",
      context:
        "This research compares the citation impact of medical journals published in different African countries.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            Citations for {journal.title}
          </DialogTitle>
          <DialogDescription>Explore citations and related research</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {citations.map((citation) => (
            <Card
              key={citation.id}
              className={`border-2 ${
                selectedCitation === citation.id ? "border-primary" : "border-muted"
              } hover:border-primary transition-colors cursor-pointer`}
              onClick={() => setSelectedCitation(citation.id)}
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">{citation.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {citation.author} ({citation.year}), {citation.source}
                </p>
                {selectedCitation === citation.id && (
                  <div className="mt-2">
                    <Sparkles className="h-4 w-4 text-yellow-500 mb-1" />
                    <p className="text-xs text-muted-foreground italic">"{citation.context}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
