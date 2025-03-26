import { Journal } from "@/data/journalData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// if (!apiKey) {
//   throw new Error("GEMINI_API_KEY environment variable is not set");
// }

const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set");
}

const configuration = apiKey;
const gemini = new GoogleGenerativeAI(configuration);

console.log("API Key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

interface Filter {
  category: string;
  value: string;
}

// Fetch journals based on search query and filters
export async function fetchJournals(
  query = "",
  page = 1,
  limit = 10,
  filters: Filter[] = []
) {
  try {
    // Fetch all journals from the API
    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/search/?query=${query}&page=${page}&page_size=${limit}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Filter journals based on search query and filters
    // let filteredJournals = journals.results.filter((journal: Journal) => {
    //   const matchesQuery =
    //     !query ||
    //     journal.journal_title.toLowerCase().includes(query.toLowerCase()) ||
    //     journal.summary.toLowerCase().includes(query.toLowerCase()) ||
    //     journal.thematic_area.thematic_area
    //       .toLowerCase()
    //       .includes(query.toLowerCase());

    //   const matchesFilters = filters.every((filter) => {
    //     switch (filter.category) {
    //       case "country":
    //         return journal.country.country === filter.value;
    //       case "thematicArea":
    //         return journal.thematic_area.thematic_area === filter.value;
    //       // case "indexing":
    //       //   return journal.google_scholar_index.includes(filter.value);
    //       case "language":
    //         return journal.language.language === filter.value;
    //         // case "accessType":
    //         //   return journal.open_access_journal === filter.value;
    //         // default:
    //         return true;
    //     }
    //   });

    //   return matchesQuery && matchesFilters;
    // });

    // return filteredJournals;
    const data = await response.json();

    return {
      results: data.results, // Journals for the current page
      total: data.count, // Total number of journals
      next: data.next, // URL for the next page
      previous: data.previous, // URL for the previous page
    };
  } catch (error) {
    console.error("Failed to fetch recommended journals:", error);
    return {
      results: [],
      total: 0,
      next: null,
      previous: null,
    };
  }
}

// Fetch AI-recommended journals
export async function fetchRecommendedJournals(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/?page=${page}&page_size=${limit}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      results: data.results, // Journals for the current page
      total: data.count, // Total number of journals
      next: data.next, // URL for the next page
      previous: data.previous, // URL for the previous page
    };
  } catch (error) {
    console.error("Failed to fetch recommended journals:", error);
    return {
      results: [],
      total: 0,
      next: null,
      previous: null,
    };
  }
}

// Fetch AI-recommended filters
export async function fetchRecommendedFilters() {
  try {
    // Fetch all journals from the API
    const response = await fetch(
      "https://backend.afrikajournals.org/journal_api/journals/"
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journals = await response.json();

    // Use Gemini to generate filter recommendations
    const prompt = `Based on the following journals, recommend some filters for searching:\n${JSON.stringify(
      journals
    )}`;
    const completion = await (gemini as any).generateContent({
      model: "gemini-pro",
      prompt: prompt,
    });

    const recommendedFilters = JSON.parse(
      (completion.data.choices[0] as any).text
    );
    return recommendedFilters;
  } catch (error) {
    console.error("Failed to fetch recommended filters:", error);
    return [];
  }
}

// Fetch similar journals based on journal ID
export async function fetchSimilarJournals(journalText: string) {
  try {
    const prompt = `Find a list of similar journals with links for the following journal:\n${journalText}`;

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
    const summary = result.choices?.[0]?.message?.content || "[]";
    return summary;
  } catch (error) {
    console.error("Failed to fetch similar journals:", error);
    return [];
  }
}

// Fetch journal volumes and articles
export async function fetchJournalVolumes(journalId: number) {
  try {
    // Fetch volumes for the given journal ID
    const volumesResponse = await fetch(
      `https://backend.afrikajournals.org/journal_api/api/volume/?journalId=${journalId}`
    );
    if (!volumesResponse.ok) {
      throw new Error(`API error: ${volumesResponse.status}`);
    }
    const volumes = await volumesResponse.json();

    // Fetch articles for each volume
    const volumesWithArticles = await Promise.all(
      volumes.map(async (volume: any) => {
        const articlesResponse = await fetch(
          `https://backend.afrikajournals.org/journal_api/api/article/?volumeId=${volume.id}`
        );
        if (!articlesResponse.ok) {
          throw new Error(`API error: ${articlesResponse.status}`);
        }
        const articles = await articlesResponse.json();
        return { ...volume, articles };
      })
    );

    return volumesWithArticles;
  } catch (error) {
    console.error("Failed to fetch journal volumes and articles:", error);
    return [];
  }
}

// Fetch journals from the backend API with pagination
export async function fetchJournalsFromAPI(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch journals:", error);
    return [];
  }
}

// Fetch journal details from the backend API
export async function fetchJournalDetailsFromAPI(journalId: string) {
  try {
    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/${journalId}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Failed to fetch journal details for ID ${journalId}:`,
      error
    );
    return null;
  }
}

// Search journals with filters from the backend API
export async function searchJournalsFromAPI(
  query = "",
  filters: { [key: string]: string } = {}
) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (query) params.append("query", query);

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/search/?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to search journals:", error);
    return { journals: [] };
  }
}

// Fetch country statistics from the backend API
export async function fetchCountryStatsFromAPI() {
  try {
    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/api/journals/country-count/`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch country stats:", error);
    return [];
  }
}

// Download statistics in various formats
export async function downloadStatsFromAPI(
  format = "csv",
  filters: { [key: string]: string } = {}
) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("format", format);

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/stats/download/?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Handle different formats
    if (format === "csv" || format === "json") {
      return await response.blob();
    } else if (format === "pdf") {
      return await response.blob();
    }

    return null;
  } catch (error) {
    console.error(`Failed to download stats in ${format} format:`, error);
    return null;
  }
}

// Fetch paginated journals from the API
export async function fetchPaginatedJournals(
  page = 1,
  limit = 10,
  query = "",
  filters: Filter[] = []
) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (query) {
      params.append("query", query);
    }

    // Add filters to query params
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        params.append(filter.category, filter.value);
      });
    }

    const response = await fetch(
      `https://backend.afrikajournals.org/journal_api/journals/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch paginated journals:", error);
    return { page, limit, total: 0, journals: [] };
  }
}

// Fetch journal statistics
export async function fetchJournalStats() {
  try {
    // Fetch journal statistics from the API
    const response = await fetch(
      "https://backend.afrikajournals.org/journal_api/api/journals/stats/"
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch journal stats:", error);
    return [];
  }
}
