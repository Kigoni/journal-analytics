interface Filter {
  category: string;
  value: string;
}

// Mock API functions to simulate fetching data from backend

// Fetch journals based on search query and filters
export async function fetchJournals(query = "", filters: Filter[] = []) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock data
  const journals = [
    {
      id: "1",
      title: "African Journal of Medical Sciences",
      publisher: "African Medical Association",
      country: "Kenya",
      description: "A peer-reviewed journal publishing original research in medical sciences relevant to Africa.",
      indexing: ["Scopus", "DOAJ", "Google Scholar"],
      isAIRecommended: false,
      thematicArea: "Medicine",
      website: "https://example.com/ajms",
      issn: "1234-5678",
      eissn: "5678-1234",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "2",
      title: "Journal of Agricultural Research in Africa",
      publisher: "Pan-African Agricultural Research Institute",
      country: "Nigeria",
      description: "Focuses on agricultural research, innovations, and sustainable farming practices in Africa.",
      indexing: ["DOAJ", "AJOL"],
      isAIRecommended: true,
      thematicArea: "Agriculture",
      website: "https://example.com/jara",
      issn: "2345-6789",
      eissn: "6789-2345",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "3",
      title: "African Social Science Review",
      publisher: "African Social Sciences Council",
      country: "South Africa",
      description: "Publishes research on social, economic, and political issues affecting African societies.",
      indexing: ["Scopus", "Web of Science"],
      isAIRecommended: false,
      thematicArea: "Social Sciences",
      website: "https://example.com/assr",
      issn: "3456-7890",
      eissn: "7890-3456",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "4",
      title: "East African Medical Journal",
      publisher: "East African Medical Publishers",
      country: "Kenya",
      description: "One of the oldest medical journals in Africa, publishing research on health issues in East Africa.",
      indexing: ["PubMed", "DOAJ", "Google Scholar"],
      isAIRecommended: true,
      thematicArea: "Medicine",
      website: "https://example.com/eamj",
      issn: "4567-8901",
      eissn: "8901-4567",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "5",
      title: "African Journal of Environmental Science",
      publisher: "African Environmental Research Network",
      country: "Ethiopia",
      description: "Focuses on environmental challenges, conservation, and sustainable development in Africa.",
      indexing: ["Scopus", "AJOL"],
      isAIRecommended: false,
      thematicArea: "Environmental Science",
      website: "https://example.com/ajes",
      issn: "5678-9012",
      eissn: "9012-5678",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "6",
      title: "West African Journal of Education",
      publisher: "West African Educational Research Association",
      country: "Ghana",
      description: "Publishes research on educational policies, practices, and innovations in West Africa.",
      indexing: ["ERIC", "AJOL"],
      isAIRecommended: true,
      thematicArea: "Education",
      website: "https://example.com/waje",
      issn: "6789-0123",
      eissn: "0123-6789",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "7",
      title: "African Journal of Business Management",
      publisher: "African Business Research Consortium",
      country: "South Africa",
      description: "Publishes research on business management practices and economic development in African contexts.",
      indexing: ["Scopus", "AJOL"],
      isAIRecommended: false,
      thematicArea: "Business",
      website: "https://example.com/ajbm",
      issn: "7890-1234",
      eissn: "1234-7890",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "8",
      title: "Journal of African Earth Sciences",
      publisher: "Pan-African Geological Society",
      country: "Morocco",
      description: "Focuses on geological research, earth sciences, and mineral resources across the African continent.",
      indexing: ["Web of Science", "Scopus"],
      isAIRecommended: true,
      thematicArea: "Earth Sciences",
      website: "https://example.com/jaes",
      issn: "8901-2345",
      eissn: "2345-8901",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "9",
      title: "African Journal of Information Systems",
      publisher: "African IT Research Association",
      country: "Kenya",
      description: "Publishes research on information systems, technology adoption, and digital transformation in Africa.",
      indexing: ["DOAJ", "Google Scholar"],
      isAIRecommended: false,
      thematicArea: "Information Technology",
      website: "https://example.com/ajis",
      issn: "9012-3456",
      eissn: "3456-9012",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "10",
      title: "Journal of African Cultural Studies",
      publisher: "African Cultural Heritage Foundation",
      country: "Senegal",
      description: "Focuses on cultural studies, heritage preservation, and indigenous knowledge systems in Africa.",
      indexing: ["AJOL", "DOAJ"],
      isAIRecommended: true,
      thematicArea: "Cultural Studies",
      website: "https://example.com/jacs",
      issn: "0123-4567",
      eissn: "4567-0123",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "11",
      title: "African Journal of Food Science",
      publisher: "African Food Research Network",
      country: "Nigeria",
      description: "Publishes research on food science, nutrition, and food security challenges in African contexts.",
      indexing: ["Scopus", "AJOL"],
      isAIRecommended: false,
      thematicArea: "Food Science",
      website: "https://example.com/ajfs",
      issn: "1234-5678",
      eissn: "5678-1234",
      language: "English",
      accessType: "Open Access",
    },
    {
      id: "12",
      title: "Journal of African Law",
      publisher: "African Legal Studies Association",
      country: "South Africa",
      description: "Focuses on legal systems, constitutional developments, and human rights issues across Africa.",
      indexing: ["Web of Science", "Scopus"],
      isAIRecommended: false,
      thematicArea: "Law",
      website: "https://example.com/jal",
      issn: "2345-6789",
      eissn: "6789-2345",
      language: "English",
      accessType: "Open Access",
    },
  ];

  // Filter journals based on search query and filters
  let filteredJournals = [...journals];

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredJournals = filteredJournals.filter(
      (journal) =>
        journal.title.toLowerCase().includes(lowerCaseQuery) ||
        journal.description.toLowerCase().includes(lowerCaseQuery) ||
        journal.thematicArea.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (filters && filters.length > 0) {
    filteredJournals = filteredJournals.filter((journal) => {
      return filters.every((filter) => {
        switch (filter.category) {
          case "country":
            return journal.country === filter.value;
          case "thematicArea":
            return journal.thematicArea === filter.value;
          case "indexing":
            return journal.indexing.includes(filter.value);
          case "language":
            return (journal?.language || "English") === filter.value;
          case "accessType":
            // Assuming all journals have an accessType property
            return (journal.accessType || "Open Access") === filter.value;
          default:
            return true;
        }
      });
    });
  }

  return filteredJournals;
}

// Fetch AI-recommended journals
export async function fetchRecommendedJournals() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Mock data - journals marked as AI recommended
  const journals = [
    {
      id: "2",
      title: "Journal of Agricultural Research in Africa",
      publisher: "Pan-African Agricultural Research Institute",
      country: "Nigeria",
      description: "Focuses on agricultural research, innovations, and sustainable farming practices in Africa.",
      indexing: ["DOAJ", "AJOL"],
      isAIRecommended: true,
      thematicArea: "Agriculture",
      website: "https://example.com/jara",
    },
    {
      id: "4",
      title: "East African Medical Journal",
      publisher: "East African Medical Publishers",
      country: "Kenya",
      description: "One of the oldest medical journals in Africa, publishing research on health issues in East Africa.",
      indexing: ["PubMed", "DOAJ", "Google Scholar"],
      isAIRecommended: true,
      thematicArea: "Medicine",
      website: "https://example.com/eamj",
    },
    {
      id: "6",
      title: "West African Journal of Education",
      publisher: "West African Educational Research Association",
      country: "Ghana",
      description: "Publishes research on educational policies, practices, and innovations in West Africa.",
      indexing: ["ERIC", "AJOL"],
      isAIRecommended: true,
      thematicArea: "Education",
      website: "https://example.com/waje",
    },
  ];

  return journals;
}

// Fetch AI-recommended filters
export async function fetchRecommendedFilters() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Mock data - AI recommended filters
  const filters: Filter[] = [
    { category: "country", value: "Tanzania" },
    { category: "country", value: "Egypt" },
    { category: "thematicArea", value: "Computer Science" },
    { category: "thematicArea", value: "Public Health" },
    { category: "indexing", value: "Web of Science" },
    { category: "language", value: "Swahili" },
    { category: "accessType", value: "Diamond Open Access" },
  ];

  return filters;
}

// Fetch similar journals based on journal ID
export async function fetchSimilarJournals(journalId: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Mock data - similar journals
  const similarJournals = [
    {
      id: "101",
      title: "African Health Sciences Journal",
      publisher: "Makerere University Medical School",
      country: "Uganda",
      description: "Publishes papers on all aspects of health sciences with a focus on African health issues.",
      indexing: ["PubMed", "DOAJ"],
    },
    {
      id: "102",
      title: "South African Medical Journal",
      publisher: "South African Medical Association",
      country: "South Africa",
      description: "One of the world's oldest peer-reviewed medical journals, focusing on health issues in South Africa.",
      indexing: ["Scopus", "Web of Science"],
    },
    {
      id: "103",
      title: "Nigerian Journal of Medicine",
      publisher: "Nigerian Medical Association",
      country: "Nigeria",
      description: "Publishes original research, case reports, and reviews on medical sciences in Nigeria.",
      indexing: ["AJOL", "Google Scholar"],
    },
    {
      id: "104",
      title: "African Journal of Primary Health Care & Family Medicine",
      publisher: "AOSIS",
      country: "South Africa",
      description: "Focuses on family medicine, primary health care, rural medicine, district health, and public health.",
      indexing: ["PubMed", "DOAJ", "Scopus"],
    },
  ];

  return similarJournals;
}

// Fetch journal statistics
export async function fetchJournalStats(journalId: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Mock data - journal statistics
  const stats = {
    // Country statistics
    countryStats: [
      { country: "Nigeria", count: 245 },
      { country: "South Africa", count: 198 },
      { country: "Kenya", count: 156 },
      { country: "Egypt", count: 134 },
      { country: "Ethiopia", count: 89 },
      { country: "Ghana", count: 76 },
      { country: "Tanzania", count: 65 },
      { country: "Uganda", count: 54 },
      { country: "Morocco", count: 48 },
      { country: "Tunisia", count: 42 },
    ],

    // Indexing statistics
    indexingStats: [
      { name: "AJOL", value: 35 },
      { name: "DOAJ", value: 25 },
      { name: "Scopus", value: 15 },
      { name: "Web of Science", value: 10 },
      { name: "PubMed", value: 8 },
      { name: "Google Scholar", value: 7 },
    ],

    // Journal activity trends
    activityTrends: [
      { month: "Jan", submissions: 120, publications: 45 },
      { month: "Feb", submissions: 140, publications: 50 },
      { month: "Mar", submissions: 160, publications: 55 },
      { month: "Apr", submissions: 180, publications: 60 },
      { month: "May", submissions: 200, publications: 65 },
      { month: "Jun", submissions: 220, publications: 70 },
      { month: "Jul", submissions: 240, publications: 75 },
      { month: "Aug", submissions: 260, publications: 80 },
      { month: "Sep", submissions: 280, publications: 85 },
      { month: "Oct", submissions: 300, publications: 90 },
      { month: "Nov", submissions: 320, publications: 95 },
      { month: "Dec", submissions: 340, publications: 100 },
    ],

    // Open Access journal growth
    oajGrowth: [
      { year: "2010", count: 50 },
      { year: "2011", count: 75 },
      { year: "2012", count: 100 },
      { year: "2013", count: 150 },
      { year: "2014", count: 200 },
      { year: "2015", count: 250 },
      { year: "2016", count: 300 },
      { year: "2017", count: 350 },
      { year: "2018", count: 400 },
      { year: "2019", count: 450 },
      { year: "2020", count: 500 },
      { year: "2021", count: 550 },
      { year: "2022", count: 600 },
      { year: "2023", count: 650 },
    ],

    // Discipline statistics
    disciplineStats: [
      { name: "Medicine", value: 250 },
      { name: "Agriculture", value: 180 },
      { name: "Social Sciences", value: 150 },
      { name: "Education", value: 120 },
      { name: "Environmental Science", value: 100 },
      { name: "Engineering", value: 80 },
      { name: "Business", value: 70 },
      { name: "Arts & Humanities", value: 60 },
    ],
  };

  return stats;
}

// Fetch journal volumes and articles
export async function fetchJournalVolumes(journalId: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock data - journal volumes and articles
  const volumes = [
    {
      id: "vol-2023-1",
      number: 45,
      year: 2023,
      articles: [
        {
          id: "art-2023-1-1",
          title: "Impact of Climate Change on Agricultural Productivity in Sub-Saharan Africa",
          abstract:
            "This study examines the effects of climate change on agricultural productivity across different regions of Sub-Saharan Africa, with a focus on staple crops.",
          authors: ["John Smith", "Mary Johnson", "Robert Nkosi"],
          type: "Research Article",
          publishedDate: "March 15, 2023",
          doi: "10.1234/ajra.2023.45.1",
          pdfUrl: "https://example.com/pdf/article1.pdf",
          downloadUrl: "https://example.com/download/article1.pdf",
          supplementaryUrl: "https://example.com/supplementary/article1",
        },
        {
          id: "art-2023-1-2",
          title: "Sustainable Farming Practices Among Smallholder Farmers in Nigeria",
          abstract:
            "This paper investigates the adoption of sustainable farming practices among smallholder farmers in Nigeria and identifies factors influencing adoption rates.",
          authors: ["Adebayo Ogunlesi", "Sarah Williams"],
          type: "Case Study",
          publishedDate: "March 15, 2023",
          doi: "10.1234/ajra.2023.45.2",
          pdfUrl: "https://example.com/pdf/article2.pdf",
          downloadUrl: "https://example.com/download/article2.pdf",
        },
        {
          id: "art-2023-1-3",
          title: "Review of Agricultural Policies in East African Countries",
          abstract:
            "A comprehensive review of agricultural policies implemented in East African countries over the past decade and their impact on food security.",
          authors: ["Elizabeth Muthoni", "Daniel Kipchoge", "James Anderson"],
          type: "Review Article",
          publishedDate: "March 15, 2023",
          doi: "10.1234/ajra.2023.45.3",
          pdfUrl: "https://example.com/pdf/article3.pdf",
          downloadUrl: "https://example.com/download/article3.pdf",
          supplementaryUrl: "https://example.com/supplementary/article3",
        },
      ],
    },
    {
      id: "vol-2022-4",
      number: 44,
      year: 2022,
      articles: [
        {
          id: "art-2022-4-1",
          title: "Irrigation Technologies for Water Conservation in Arid Regions",
          abstract:
            "This research evaluates various irrigation technologies designed for water conservation in arid regions of Africa and their effectiveness.",
          authors: ["Mohammed Al-Hassan", "Patricia Nyong"],
          type: "Research Article",
          publishedDate: "December 10, 2022",
          doi: "10.1234/ajra.2022.44.1",
          pdfUrl: "https://example.com/pdf/article4.pdf",
          downloadUrl: "https://example.com/download/article4.pdf",
        },
        {
          id: "art-2022-4-2",
          title: "Impact of Agricultural Extension Services on Crop Yields in Ghana",
          abstract:
            "An analysis of how agricultural extension services have influenced crop yields among farmers in different regions of Ghana.",
          authors: ["Kwame Asante", "Grace Mensah"],
          type: "Research Article",
          publishedDate: "December 10, 2022",
          doi: "10.1234/ajra.2022.44.2",
          pdfUrl: "https://example.com/pdf/article5.pdf",
          downloadUrl: "https://example.com/download/article5.pdf",
        },
      ],
    },
    {
      id: "vol-2022-3",
      number: 43,
      year: 2022,
      articles: [
        {
          id: "art-2022-3-1",
          title: "Soil Fertility Management Practices in Smallholder Farming Systems",
          abstract:
            "This study documents and analyzes soil fertility management practices employed by smallholder farmers across different agro-ecological zones.",
          authors: ["Thomas Banda", "Lucy Mwangi", "Peter Ochieng"],
          type: "Research Article",
          publishedDate: "September 5, 2022",
          doi: "10.1234/ajra.2022.43.1",
          pdfUrl: "https://example.com/pdf/article6.pdf",
          downloadUrl: "https://example.com/download/article6.pdf",
          supplementaryUrl: "https://example.com/supplementary/article6",
        },
        {
          id: "art-2022-3-2",
          title: "Climate-Smart Agriculture: Adoption Challenges and Opportunities",
          abstract:
            "A review of the challenges and opportunities associated with the adoption of climate-smart agricultural practices in African countries.",
          authors: ["Rachel Naidoo", "Samuel Otieno"],
          type: "Review Article",
          publishedDate: "September 5, 2022",
          doi: "10.1234/ajra.2022.43.2",
          pdfUrl: "https://example.com/pdf/article7.pdf",
          downloadUrl: "https://example.com/download/article7.pdf",
        },
        {
          id: "art-2022-3-3",
          title: "Gender Disparities in Access to Agricultural Resources",
          abstract:
            "This paper examines gender disparities in access to key agricultural resources such as land, credit, and extension services in rural communities.",
          authors: ["Fatima Ibrahim", "John Mwangi"],
          type: "Research Article",
          publishedDate: "September 5, 2022",
          doi: "10.1234/ajra.2022.43.3",
          pdfUrl: "https://example.com/pdf/article8.pdf",
          downloadUrl: "https://example.com/download/article8.pdf",
        },
        {
          id: "art-2022-3-4",
          title: "Value Chain Analysis of Cassava Production in Nigeria",
          abstract:
            "A comprehensive analysis of the cassava value chain in Nigeria, identifying bottlenecks and opportunities for improvement.",
          authors: ["Oluwaseun Adeyemi", "Blessing Okonkwo"],
          type: "Case Study",
          publishedDate: "September 5, 2022",
          doi: "10.1234/ajra.2022.43.4",
          pdfUrl: "https://example.com/pdf/article9.pdf",
          downloadUrl: "https://example.com/download/article9.pdf",
          supplementaryUrl: "https://example.com/supplementary/article9",
        },
      ],
    },
  ];

  // For demonstration purposes, return the same volumes for any journal ID
  // In a real implementation, you would filter based on the journalId
  return volumes;
}

// Add these API service functions at the end of the file

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
    // Return mock data as fallback
    return fetchJournals();
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
    // Return mock data as fallback
    const journals = await fetchJournals();
    return journals.find((j) => j.id === journalId) || null;
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
    // Return mock data as fallback
    return { journals: await fetchJournals(query, Object.entries(filters).map(([key, value]) => ({ category: key, value }))) };  }
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
    // Return mock data as fallback
    const stats = await fetchJournalStats("any");
    return stats.countryStats;
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

// Add this function to the api.ts file

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

    // Fallback to mock data
    const allJournals = await fetchJournals(query, filters);

    // Simulate pagination with the mock data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJournals = allJournals.slice(startIndex, endIndex);

    return {
      page,
      limit,
      total: allJournals.length,
      journals: paginatedJournals,
    };
  }
}
