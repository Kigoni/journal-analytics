import { useState, useEffect } from "react";
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
import { GoogleGenerativeAI } from '@google/generative-ai';

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

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const configuration = apiKey;
const gemini = new GoogleGenerativeAI(configuration);

console.log("API Key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function CitationsDialog({ journal, open, onOpenChange }: CitationsDialogProps) {
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCitations = async () => {
      setIsLoading(true);
      try {
        // Fetch citations from the API
        const response = await fetch('https://backend.afrikajournals.org/journal_api/journals/');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        // Use Gemini AI to generate citations based on the journal data
        const prompt = `Based on the following journal, generate relevant citations:\n${JSON.stringify(data)}`;
        const completion = await (gemini as any).generateContent({
          model: "gemini-pro",
          prompt: prompt,
        });
    

        const aiCitations = JSON.parse((completion.data.choices[0] as any).text);
        setCitations(aiCitations);
      } catch (error) {
        console.error("Failed to fetch citations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitations();
  }, [journal]);

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
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            citations.map((citation) => (
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
            ))
          )}
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
