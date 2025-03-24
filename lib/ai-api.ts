import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface Filter {
  category: string;
  value: string;
  label: string;
}

interface Summary {
  summary: string;
}

interface Recommendation {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
}

interface TrendData {
  publicationTrends: { year: number; count: number }[];
  citationTrends: { year: number; count: number }[];
  hotTopics: { name: string; growth: number }[];
  insights: {
    publications: string;
    citations: string;
    topics: string;
  };
}

// Fetch journals based on search query and filters
export async function fetchJournals(query = "", filters: Filter[] = []) {
  try {
    // Fetch all journals from the API
    const response = await fetch('https://backend.afrikajournals.org/journal_api/journals/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journals = await response.json();

    // Filter journals based on search query and filters
    let filteredJournals = journals.filter((journal: any) => {
      const matchesQuery = !query ||
        journal.title.toLowerCase().includes(query.toLowerCase()) ||
        journal.description.toLowerCase().includes(query.toLowerCase()) ||
        journal.thematicArea.toLowerCase().includes(query.toLowerCase());

      const matchesFilters = filters.every((filter) => {
        switch (filter.category) {
          case "country":
            return journal.country === filter.value;
          case "thematicArea":
            return journal.thematicArea === filter.value;
          case "indexing":
            return journal.indexing.includes(filter.value);
          case "language":
            return journal.language === filter.value;
          case "accessType":
            return journal.accessType === filter.value;
          default:
            return true;
        }
      });

      return matchesQuery && matchesFilters;
    });

    return filteredJournals;
  } catch (error) {
    console.error("Failed to fetch journals:", error);
    return [];
  }
}

// Fetch AI-recommended journals
export async function fetchRecommendedJournals() {
  try {
    // Fetch all journals from the API
    const response = await fetch('https://backend.afrikajournals.org/journal_api/journals/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journals = await response.json();

    // Use OpenAI to generate recommendations
    const prompt = `Based on the following journals, recommend a few that are related:\n${JSON.stringify(journals)}`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendedJournals = JSON.parse((completion.data?.choices?.[0]?.message?.content) ?? '[]');
    return recommendedJournals;
  } catch (error) {
    console.error("Failed to fetch recommended journals:", error);
    return [];
  }
}

// Fetch AI-recommended filters
export async function fetchRecommendedFilters() {
  try {
    // Fetch all journals from the API
    const response = await fetch('https://backend.afrikajournals.org/journal_api/journals/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journals = await response.json();

    // Use OpenAI to generate filter recommendations
    const prompt = `Based on the following journals, recommend some filters for searching:\n${JSON.stringify(journals)}`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendedFilters = JSON.parse((completion.data?.choices?.[0]?.message?.content) ?? '[]');
    return recommendedFilters;
  } catch (error) {
    console.error("Failed to fetch recommended filters:", error);
    return [];
  }
}

// Fetch AI-suggested filters based on search query
export async function fetchAISuggestedFilters(query: string): Promise<Filter[]> {
  try {
    // Use OpenAI to generate filter suggestions based on the query
    const prompt = `Suggest filters for searching journals related to: "${query}"`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestedFilters = JSON.parse((completion.data?.choices?.[0]?.message?.content) ?? '[]');
    return suggestedFilters;
  } catch (error) {
    console.error("Failed to fetch AI-suggested filters:", error);
    return [];
  }
}

// Fetch AI-generated summary for a journal
export async function fetchAISummary(journalId: string): Promise<Summary> {
  try {
    // Fetch journal details from the API
    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/${journalId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journal = await response.json();

    // Use OpenAI to generate a summary
    const prompt = `Generate a summary for the following journal:\n${JSON.stringify(journal)}`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.data?.choices?.[0]?.message?.content ?? 'No summary available.';
    return { summary };
  } catch (error) {
    console.error("Failed to fetch AI summary:", error);
    return { summary: "No summary available." };
  }
}

// Fetch AI-recommended citations
export async function fetchRecommendedCitations(journalId: string): Promise<Recommendation[]> {
  try {
    // Fetch journal details from the API
    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/${journalId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const journal = await response.json();

    // Use OpenAI to recommend citations
    const prompt = `Recommend citations for the following journal:\n${JSON.stringify(journal)}`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendations = JSON.parse((completion.data?.choices?.[0]?.message?.content) ?? '[]');
    return recommendations;
  } catch (error) {
    console.error("Failed to fetch recommended citations:", error);
    return [];
  }
}

// Fetch AI trend analysis data
export async function fetchAITrends(query?: string, thematicArea?: string): Promise<TrendData> {
  try {
    // Use OpenAI to generate trend analysis data
    const prompt = `Generate trend analysis data for the query: "${query}" and thematic area: "${thematicArea}"`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const trendData = JSON.parse((completion.data?.choices?.[0]?.message?.content) ?? '[]');
    return trendData;
  } catch (error) {
    console.error("Failed to fetch AI trend analysis data:", error);
    return {
      publicationTrends: [],
      citationTrends: [],
      hotTopics: [],
      insights: { publications: "", citations: "", topics: "" },
    };
  }
}

// Fetch journal volumes and articles
export async function fetchJournalVolumes(journalId: string) {
  try {
    // Fetch volumes for the given journal ID
    const volumesResponse = await fetch(`https://backend.afrikajournals.org/journal_api/api/volume/?journalId=${journalId}`);
    if (!volumesResponse.ok) {
      throw new Error(`API error: ${volumesResponse.status}`);
    }
    const volumes = await volumesResponse.json();

    // Fetch articles for each volume
    const volumesWithArticles = await Promise.all(
      volumes.map(async (volume: any) => {
        const articlesResponse = await fetch(`https://backend.afrikajournals.org/journal_api/api/article/?volumeId=${volume.id}`);
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

// Fetch thematic areas
export async function fetchThematicAreas() {
  try {
    const response = await fetch('https://backend.afrikajournals.org/journal_api/api/thematic/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch thematic areas:", error);
    return [];
  }
}

// Fetch platforms
export async function fetchPlatforms() {
  try {
    const response = await fetch('https://backend.afrikajournals.org/journal_api/api/platform/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch platforms:", error);
    return [];
  }
}

// Fetch languages
export async function fetchLanguages() {
  try {
    const response = await fetch('https://backend.afrikajournals.org/journal_api/api/languages/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    return [];
  }
}

// Fetch countries
export async function fetchCountries() {
  try {
    const response = await fetch('https://backend.afrikajournals.org/journal_api/api/country/');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return [];
  }
}

// Fetch journals from the backend API with pagination
export async function fetchJournalsFromAPI(page = 1, limit = 10) {
  try {
    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/?page=${page}&limit=${limit}`);
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
    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/${journalId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch journal details for ID ${journalId}:`, error);
    return null;
  }
}

// Search journals with filters from the backend API
export async function searchJournalsFromAPI(query = "", filters: { [key: string]: string } = {}) {
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

    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/search/?${params.toString()}`);
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
    const response = await fetch(`https://backend.afrikajournals.org/journal_api/api/journals/country-count/`);
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
export async function downloadStatsFromAPI(format = "csv", filters: { [key: string]: string } = {}) {
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
      `https://backend.afrikajournals.org/journal_api/journals/stats/download/?${params.toString()}`,
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
export async function fetchPaginatedJournals(page = 1, limit = 10, query = "", filters: Filter[] = []) {
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

    const response = await fetch(`https://backend.afrikajournals.org/journal_api/journals/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch paginated journals:", error);
    return { page, limit, total: 0, journals: [] };
  }
}
