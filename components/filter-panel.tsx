"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

// Define the types for the props and filters
interface Filter {
  id: string;
  category: string;
  value: string;
  label?: string;
}

interface FilterPanelProps {
  recommendedFilters: Filter[];
  activeFilters: Filter[];
  onFilterChange: (filters: Filter[]) => void;
}

const filterCategories = [
  { id: "country", label: "Country" },
  { id: "thematicArea", label: "Thematic Area" },
  { id: "language", label: "Language" },
  { id: "indexing", label: "Indexing Status" },
  { id: "accessType", label: "Access Type" },
];

export default function FilterPanel({ recommendedFilters, activeFilters, onFilterChange }: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>(activeFilters || []);

  useEffect(() => {
    setSelectedFilters(activeFilters || []);
  }, [activeFilters]);

  const handleFilterSelect = (category: string, value: string, label: string) => {
    const filterId = `${category}-${value}`;
    const isSelected = selectedFilters.some((f) => f.id === filterId);

    let updatedFilters: Filter[];
    if (isSelected) {
      updatedFilters = selectedFilters.filter((f) => f.id !== filterId);
    } else {
      updatedFilters = [...selectedFilters, { id: filterId, category, value, label }];
    }

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const isFilterSelected = (category: string, value: string) => {
    return selectedFilters.some((f) => f.id === `${category}-${value}`);
  };

  // Group recommended filters by category
  const groupedRecommendedFilters = recommendedFilters.reduce((acc: { [key: string]: Filter[] }, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {});

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="font-medium text-sm">{category.label}</h3>
              <div className="space-y-2">
                {/* Static filter options */}
                {category.id === "country" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="country-kenya"
                        checked={isFilterSelected("country", "Kenya")}
                        onCheckedChange={() => handleFilterSelect("country", "Kenya", category.label)}
                      />
                      <Label htmlFor="country-kenya">Kenya</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="country-nigeria"
                        checked={isFilterSelected("country", "Nigeria")}
                        onCheckedChange={() => handleFilterSelect("country", "Nigeria", category.label)}
                      />
                      <Label htmlFor="country-nigeria">Nigeria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="country-southafrica"
                        checked={isFilterSelected("country", "South Africa")}
                        onCheckedChange={() => handleFilterSelect("country", "South Africa", category.label)}
                      />
                      <Label htmlFor="country-southafrica">South Africa</Label>
                    </div>
                  </>
                )}

                {category.id === "thematicArea" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thematicArea-medicine"
                        checked={isFilterSelected("thematicArea", "Medicine")}
                        onCheckedChange={() => handleFilterSelect("thematicArea", "Medicine", category.label)}
                      />
                      <Label htmlFor="thematicArea-medicine">Medicine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thematicArea-agriculture"
                        checked={isFilterSelected("thematicArea", "Agriculture")}
                        onCheckedChange={() => handleFilterSelect("thematicArea", "Agriculture", category.label)}
                      />
                      <Label htmlFor="thematicArea-agriculture">Agriculture</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thematicArea-socialsciences"
                        checked={isFilterSelected("thematicArea", "Social Sciences")}
                        onCheckedChange={() => handleFilterSelect("thematicArea", "Social Sciences", category.label)}
                      />
                      <Label htmlFor="thematicArea-socialsciences">Social Sciences</Label>
                    </div>
                  </>
                )}

                {category.id === "language" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="language-english"
                        checked={isFilterSelected("language", "English")}
                        onCheckedChange={() => handleFilterSelect("language", "English", category.label)}
                      />
                      <Label htmlFor="language-english">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="language-french"
                        checked={isFilterSelected("language", "French")}
                        onCheckedChange={() => handleFilterSelect("language", "French", category.label)}
                      />
                      <Label htmlFor="language-french">French</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="language-arabic"
                        checked={isFilterSelected("language", "Arabic")}
                        onCheckedChange={() => handleFilterSelect("language", "Arabic", category.label)}
                      />
                      <Label htmlFor="language-arabic">Arabic</Label>
                    </div>
                  </>
                )}

                {category.id === "indexing" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indexing-scopus"
                        checked={isFilterSelected("indexing", "Scopus")}
                        onCheckedChange={() => handleFilterSelect("indexing", "Scopus", category.label)}
                      />
                      <Label htmlFor="indexing-scopus">Scopus</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indexing-doaj"
                        checked={isFilterSelected("indexing", "DOAJ")}
                        onCheckedChange={() => handleFilterSelect("indexing", "DOAJ", category.label)}
                      />
                      <Label htmlFor="indexing-doaj">DOAJ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indexing-googlescholar"
                        checked={isFilterSelected("indexing", "Google Scholar")}
                        onCheckedChange={() => handleFilterSelect("indexing", "Google Scholar", category.label)}
                      />
                      <Label htmlFor="indexing-googlescholar">Google Scholar</Label>
                    </div>
                  </>
                )}

                {category.id === "accessType" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accessType-openaccess"
                        checked={isFilterSelected("accessType", "Open Access")}
                        onCheckedChange={() => handleFilterSelect("accessType", "Open Access", category.label)}
                      />
                      <Label htmlFor="accessType-openaccess">Open Access</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accessType-subscription"
                        checked={isFilterSelected("accessType", "Subscription")}
                        onCheckedChange={() => handleFilterSelect("accessType", "Subscription", category.label)}
                      />
                      <Label htmlFor="accessType-subscription">Subscription</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accessType-hybrid"
                        checked={isFilterSelected("accessType", "Hybrid")}
                        onCheckedChange={() => handleFilterSelect("accessType", "Hybrid", category.label)}
                      />
                      <Label htmlFor="accessType-hybrid">Hybrid</Label>
                    </div>
                  </>
                )}

                {/* AI Recommended Filters */}
                {groupedRecommendedFilters[category.id] && groupedRecommendedFilters[category.id].length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs font-medium text-muted-foreground">AI Recommended</span>
                    </div>
                    {groupedRecommendedFilters[category.id].map((filter) => (
                      <div key={`${filter.category}-${filter.value}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filter.category}-${filter.value}`}
                          checked={isFilterSelected(filter.category, filter.value)}
                          onCheckedChange={() => handleFilterSelect(filter.category, filter.value, category.label)}
                        />
                        <Label htmlFor={`${filter.category}-${filter.value}`}>
                          {filter.value}
                          <Badge variant="outline" className="ml-2 text-xs py-0">
                            AI
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
