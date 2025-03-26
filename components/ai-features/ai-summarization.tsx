"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchAISummary } from "@/lib/ai-api";

interface AISummarizationProps {
  journalId: number;
  description: string;
}

export default function AISummarization({
  journalId,
  description,
}: AISummarizationProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAISummary(description);
      setSummary(data.summary);
      setIsExpanded(true);
    } catch (error) {
      //.error("Failed to fetch AI summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-purple-600 p-0 h-auto"
          onClick={generateSummary}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating AI summary...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              Generate AI summary
            </>
          )}
        </Button>
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-800">
                AI-Generated Summary
              </span>
            </div>
            <p className="text-sm">{summary}</p>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-purple-600 p-0 h-auto"
              onClick={() => setIsExpanded(false)}
            >
              Hide summary
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
