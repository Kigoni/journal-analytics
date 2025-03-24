"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, SlidersHorizontal, BookOpen, BarChart } from "lucide-react";
import JournalList from "@/components/journal-list";
import FilterPanel from "@/components/filter-panel";
import JournalStats from "@/components/journal-stats";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchJournals, fetchRecommendedJournals, fetchRecommendedFilters } from "@/lib/api";
import AISuggestedFilters from "@/components/ai-features/ai-suggested-filters";
// import VoiceSearch from "@/components/ai-features/voice-search";
import AITrendAnalysis from "@/components/ai-features/ai-trend-analysis";

// Define the types for the props and filters
interface Journal {
  id: string;
  title: string;
  publisher: string;
  country: string;
  description: string;
  indexing: string[];
  isAIRecommended: boolean;
  thematicArea: string;
  website: string;
  issn?: string;
  eissn?: string;
}

interface Filter {
  id: string;
  category: string;
  value: string;
  label?: string;
}

interface JournalSearchProps {
  initialQuery?: string;
  searchType?: string;
  showFilters?: boolean;
}

export default function JournalSearch({
  initialQuery = "",
  searchType = "keyword",
  showFilters: showFiltersProp = false,
}: JournalSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [showFiltersState, setShowFiltersState] = useState(showFiltersProp);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [recommendedJournals, setRecommendedJournals] = useState<Journal[]>([]);
  const [recommendedFilters, setRecommendedFilters] = useState<Filter[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState("journals");
  const [selectedThematicArea, setSelectedThematicArea] = useState("");

  // Fetch recommended journals on initial load
  useEffect(() => {
    const loadRecommendedJournals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRecommendedJournals();
        setRecommendedJournals(data);
        setTotalResults(data.length);
      } catch (error) {
        console.error("Failed to fetch recommended journals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadRecommendedFilters = async () => {
      try {
        const data = await fetchRecommendedFilters();
        setRecommendedFilters(data.map((filter: Filter) => ({
          ...filter,
          id: `${filter.category}-${filter.value}`
        })));
      } catch (error) {
        console.error("Failed to fetch recommended filters:", error);
      }
    };

    loadRecommendedJournals();
    loadRecommendedFilters();
  }, []);

  // Update the useEffect that fetches journals to use the initialQuery and searchType
  useEffect(() => {
    const searchJournals = async () => {
      if (!debouncedSearchQuery && activeFilters.length === 0) {
        setJournals(recommendedJournals);
        setTotalResults(recommendedJournals.length);
        return;
      }

      setIsLoading(true);
      try {
        // Use the searchJournalsFromAPI function for real API integration
        const data = await fetchJournals(debouncedSearchQuery, activeFilters,);
        setJournals(data);
        setTotalResults(data.length);

        // Update selected thematic area if there's a filter for it
        const thematicFilter = activeFilters.find((f) => f.category === "thematicArea");
        setSelectedThematicArea(thematicFilter ? thematicFilter.value : "");
      } catch (error) {
        console.error("Failed to fetch journals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchJournals();
  }, [debouncedSearchQuery, activeFilters, recommendedJournals, searchType]);

  // Update the component to use the showFilters prop
  const handleFilterToggle = () => {
    setShowFiltersState(!showFiltersState);
  };

  const handleFilterChange = (filters: Filter[]) => {
    setActiveFilters(filters);
  };

  const handleFilterRemove = (filter: Filter) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== filter.id));
  };

  const handleApplySuggestedFilter = (filter: { category: string; value: string; label?: string }) => {
    const filterId = `${filter.category}-${filter.value}`;
    const isAlreadyApplied = activeFilters.some((f) => f.id === filterId);

    if (!isAlreadyApplied) {
      const newFilter = {
        id: filterId,
        category: filter.category,
        value: filter.value,
        label: filter.label,
      };
      setActiveFilters([...activeFilters, newFilter]);
    }
  };

  // const handleVoiceSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journals, keywords, or disciplines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFilterToggle} className="bg-white/80 backdrop-blur-sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {/* <VoiceSearch onSearch={handleVoiceSearch} /> */}
        </div>
      </div>

      {/* AI Suggested Filters */}
      {debouncedSearchQuery && (
        <AISuggestedFilters query={debouncedSearchQuery} onApplyFilter={handleApplySuggestedFilter} />
      )}

      {/* Conditional rendering for the FilterPanel */}
      {(showFiltersState || showFiltersProp) && (
        <FilterPanel
          recommendedFilters={recommendedFilters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
              {filter.label}: {filter.value}
              <button onClick={() => handleFilterRemove(filter)} className="ml-1 rounded-full hover:bg-muted p-1">
                ×
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])} className="h-6">
            Clear all
          </Button>
        </div>
      )}

      <div className="bg-white/50 rounded-md px-4 py-2 flex items-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{totalResults}</span> journals found
          {debouncedSearchQuery && (
            <span>
              {" "}
              for "<span className="italic">{debouncedSearchQuery}</span>"
            </span>
          )}
          {activeFilters.length > 0 && (
            <span>
              {" "}
              with <span className="font-medium">{activeFilters.length}</span> active filters
            </span>
          )}
        </p>
      </div>

      <Tabs defaultValue="journals" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="journals">
            <BookOpen className="h-4 w-4 mr-2" />
            Journals
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="journals" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <JournalList journals={journals} itemsPerPage={10} />
          )}
        </TabsContent>
        <TabsContent value="analytics" className="mt-4 space-y-6">
          <JournalStats journals={journals} activeFilters={activeFilters} />

          {/* AI Trend Analysis */}
          <AITrendAnalysis query={debouncedSearchQuery} thematicArea={selectedThematicArea} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
