"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  fetchJournals,
  fetchRecommendedJournals,
  fetchRecommendedFilters,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
// import VoiceSearch from "@/components/ai-features/voice-search"
import AISuggestedFilters from "./ai-features/ai-suggested-filters";
import JournalList from "./journal-list";
import { Journal } from "@/data/journalData";

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

export default function AdvancedSearchBar({
  initialQuery = "",
  searchType = "keyword",
  showFilters: showFiltersProp = false,
}: JournalSearchProps) {
  const [setSearchType] = useState("keyword");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch recommended journals on initial load
  useEffect(() => {
    const loadRecommendedJournals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRecommendedJournals(currentPage, itemsPerPage);
        setRecommendedJournals(data.results);
        setTotalResults(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch recommended journals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // const loadRecommendedFilters = async () => {
    //   try {
    //     const data = await fetchRecommendedFilters();
    //     setRecommendedFilters(
    //       data.map((filter: { category: string; value: string }) => ({
    //         ...filter,
    //         id: `${filter.category}-${filter.value}`,
    //       }))
    //     );
    //   } catch (error) {
    //     console.error("Failed to fetch recommended filters:", error);
    //   }
    // };

    loadRecommendedJournals();
    // loadRecommendedFilters();
  }, [currentPage]);

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
        const data = await fetchJournals(
          debouncedSearchQuery,
          currentPage,
          itemsPerPage,
          activeFilters
        );

        setJournals(data.results);
        setTotalResults(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));

        // Update selected thematic area if there's a filter for it
        const thematicFilter = activeFilters.find(
          (f) => f.category === "thematicArea"
        );
        setSelectedThematicArea(thematicFilter ? thematicFilter.value : "");
      } catch (error) {
        console.error("Failed to fetch journals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchJournals();
  }, [
    debouncedSearchQuery,
    activeFilters,
    recommendedJournals,
    searchType,
    currentPage,
  ]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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

  const handleApplySuggestedFilter = (filter: {
    category: string;
    value: string;
    label?: string;
  }) => {
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
    <div className="flex flex-col">
      <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between flex-wrap">
              <h2 className="text-xl font-semibold">Find Academic Journals</h2>
              <Button
                variant="outline"
                size="sm"
                // onClick={onSubmitClick}
                className="bg-primary/10 hover:bg-primary/20 text-primary"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Submit Journal
              </Button>
            </div>

            <Tabs
              defaultValue="keyword"
              value={searchType}
              className="h-16 lg:h-10 w-full"
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="keyword">Keywords/Title</TabsTrigger>
                <TabsTrigger value="discipline">Discipline</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="abstract">Abstract</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className=" flex flex-wrap gap-2">
              <div className="relative flex-1 flex-wrap">
                <Input
                  className="h-12 pl-10 min-w-40 rounded-md text-base"
                  placeholder={
                    searchType === "keyword"
                      ? "Search by keywords or journal title..."
                      : searchType === "discipline"
                      ? "Search by academic discipline..."
                      : searchType === "country"
                      ? "Search by country of publication..."
                      : "Search within journal abstracts..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // onKeyDown={handleKeyDown}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>

              {/* <VoiceSearch onSearch={handleVoiceSearch} /> */}
              {/* AI Suggested Filters */}
              {/* {debouncedSearchQuery && (
        <AISuggestedFilters query={debouncedSearchQuery} onApplyFilter={handleApplySuggestedFilter} />
      )} */}

              <div className="flex">
                <Button size="sm" className="mr-1 h-12">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Search
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleFilterToggle}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="font-medium">AI-Enhanced:</span> Our search uses
              machine learning to improve results based on your research
              interests
            </p>
          </div>
        </CardContent>
      </Card>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          <JournalList journals={journals} itemsPerPage={10} />
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
