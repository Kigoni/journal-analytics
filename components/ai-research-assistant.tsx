import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Search, BookOpen, FileText, Download, Send, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';


interface AIResearchAssistantProps {
  open: boolean;
  onOpenChange: () => void;
}

interface ResearchRecommendation {
  title: string;
  journals: string[];
  relevance: number;
}

interface JournalRecommendation {
  title: string;
  match: string;
  reason: string;
}

interface Message {
  role: string;
  content: string;
}

const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set");
}

const configuration = apiKey;

export default function AIResearchAssistant({ open, onOpenChange }: AIResearchAssistantProps) {
  const [query, setQuery] = useState("");
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingJournals, setIsLoadingJournals] = useState(false);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");
  const [recommendations, setRecommendations] = useState<ResearchRecommendation[]>([]);
  const [journalRecommendations, setJournalRecommendations] = useState<JournalRecommendation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (open) {
      fetchRecommendations();
      fetchJournalRecommendations();
    }
  }, [open]);

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const response = await fetch('https://backend.afrikajournals.org/journal_api/api/article/');
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const prompt = `Recommend research topics:\n${JSON.stringify(data)}`;

    // Send request to OpenRouter
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const result = await openRouterResponse.json();
    const textResponse = result.choices?.[0]?.message?.content || "[]";
      if (textResponse) {
        try {
          setRecommendations(JSON.parse(textResponse));
        } catch (parseError) {
          //.error("Error parsing AI response:", parseError);
        }
      }
    } catch (error) {
      //.error("Failed to fetch research recommendations:", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const fetchJournalRecommendations = async () => {
    setIsLoadingJournals(true);
    try {
      const response = await fetch('https://backend.afrikajournals.org/journal_api/journals/');
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const prompt = `Recommend journals based on interests:\n${JSON.stringify(data)}`;

      // Send request to OpenRouter
      const openRouterResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-small-3.1-24b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );
  
      if (!openRouterResponse.ok) {
        throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
      }
  
      const result = await openRouterResponse.json();
      const textResponse = result.choices?.[0]?.message?.content || "[]";
      if (textResponse) {
        try {
          setJournalRecommendations(JSON.parse(textResponse));
        } catch (parseError) {
          //.error("Error parsing AI response:", parseError);
        }
      }
    } catch (error) {
      //.error("Failed to fetch journal recommendations:", error);
    } finally {
      setIsLoadingJournals(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoadingQuery(true);
    try {

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: query },
      ]);
     


      const prompt = `Recommend journals based on interests::\n${query}`;

      // Send request to OpenRouter
      const openRouterResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-small-3.1-24b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7, 
          }),
        }
      );
  
      if (!openRouterResponse.ok) {
        throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
      }
  
      const result = await openRouterResponse.json();
      const textResponse = result.choices?.[0]?.message?.content || "[]";
      if (textResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: textResponse },
        ]);
      }
    } catch (error) {
      //.error("Failed to process query:", error);
    } finally {
      setIsLoadingQuery(false);
    }
  };

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

            <div className="space-y-4 min-h-[300px] flex flex-col">
  <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none w-4/5 self-center">
    <p className="text-sm">
      Hello! I'm your AI research assistant. I can help you discover relevant journals, find research
      topics, and navigate the academic landscape. What would you like to know today?
    </p>
  </div>
  {
    messages.map((message, index) => (
      <div key={index} className={`message ${message.role}`}>
        <div className={`p-3 rounded-lg w-4/5 ${message.role === 'ai' ? 'self-start bg-primary/10' : 'self-end bg-green-100'}`}>
          <p className="text-sm">
            {message.content}
          </p>
        </div>
      </div>
    ))
  }
</div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                placeholder="Ask about journals, research topics, or academic trends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoadingQuery}>
                {isLoadingQuery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </TabsContent>    

          <TabsContent value="topics" className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">AI-Recommended Research Topics</h3>
            </div>

            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
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
                ))
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="journals" className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Personalized Journal Recommendations</h3>
            </div>

            <div className="space-y-4">
              {journalRecommendations.length > 0 ? (
                journalRecommendations.map((journal, index) => (
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
                ))
              ) : (
                <p>No journal recommendations available.</p>
              )}
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
  );
}
