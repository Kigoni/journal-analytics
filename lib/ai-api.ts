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

// AI API functions to simulate fetching data from AI-powered backend

// Fetch AI-suggested filters based on search query
export async function fetchAISuggestedFilters(query: string): Promise<Filter[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Mock data - AI suggested filters based on query
  const defaultFilters: Filter[] = [
    { category: "thematicArea", value: "Climate Science", label: "Field" },
    { category: "country", value: "Kenya", label: "Country" },
    { category: "indexing", value: "Scopus", label: "Indexed in" },
    { category: "language", value: "English", label: "Language" },
    { category: "accessType", value: "Open Access", label: "Access" },
  ];

  // For agriculture-related queries
  if (query.toLowerCase().includes("agriculture") || query.toLowerCase().includes("farming")) {
    return [
      { category: "thematicArea", value: "Agriculture", label: "Field" },
      { category: "thematicArea", value: "Food Security", label: "Field" },
      { category: "country", value: "Nigeria", label: "Country" },
      { category: "indexing", value: "AJOL", label: "Indexed in" },
    ];
  }

  // For medical-related queries
  if (query.toLowerCase().includes("medical") || query.toLowerCase().includes("health")) {
    return [
      { category: "thematicArea", value: "Medicine", label: "Field" },
      { category: "thematicArea", value: "Public Health", label: "Field" },
      { category: "country", value: "South Africa", label: "Country" },
      { category: "indexing", value: "PubMed", label: "Indexed in" },
    ];
  }

  // For technology-related queries
  if (query.toLowerCase().includes("technology") || query.toLowerCase().includes("digital")) {
    return [
      { category: "thematicArea", value: "Information Technology", label: "Field" },
      { category: "thematicArea", value: "Computer Science", label: "Field" },
      { category: "country", value: "Kenya", label: "Country" },
      { category: "indexing", value: "IEEE", label: "Indexed in" },
    ];
  }

  return defaultFilters;
}

// Fetch AI-generated summary for a journal
export async function fetchAISummary(journalId: string): Promise<Summary> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data - AI generated summaries
  const summaries: { [key: string]: Summary } = {
    "1": {
      summary:
        "This peer-reviewed journal focuses on medical sciences in Africa, with particular emphasis on tropical diseases, public health interventions, and healthcare systems strengthening. It publishes original research, reviews, and case studies that address the unique health challenges facing African populations. The journal has a strong reputation for rigorous peer review and has been instrumental in shaping health policies across the continent.",
    },
    "2": {
      summary:
        "Dedicated to agricultural research in Africa, this journal publishes cutting-edge studies on sustainable farming practices, crop improvement, livestock management, and food security. It emphasizes research that addresses the challenges of climate change, resource constraints, and market access for smallholder farmers. The journal serves as a vital platform for knowledge exchange between researchers, policymakers, and agricultural practitioners across Africa.",
    },
    "3": {
      summary:
        "This journal examines social, economic, and political issues affecting African societies through a multidisciplinary lens. It publishes research on governance, development, education, gender, and cultural dynamics. The journal is particularly noted for its critical analysis of policy frameworks and their impacts on marginalized communities. It has become an essential resource for scholars, policymakers, and development practitioners working on social transformation in Africa.",
    },
    "4": {
      summary:
        "As one of the oldest medical journals in Africa, this publication has a distinguished history of advancing healthcare knowledge in East Africa. It focuses on regional health challenges, disease patterns, and healthcare delivery systems. The journal has been instrumental in documenting the evolution of medical practice in the region and supporting evidence-based healthcare policy development. It maintains high standards of peer review and ethical research practices.",
    },
    "5": {
      summary:
        "This journal addresses environmental challenges and sustainable development in Africa through interdisciplinary research. It covers topics including conservation, climate change adaptation, natural resource management, and environmental policy. The journal emphasizes research that balances ecological preservation with socioeconomic development needs. It serves as a platform for sharing innovative approaches to environmental stewardship across diverse African ecosystems.",
    },
  };

  // Default summary for journals not in our mock data
  const defaultSummary: Summary = {
    summary:
      "This peer-reviewed African journal publishes original research, reviews, and scholarly articles that contribute to its field. It maintains rigorous academic standards and serves as an important platform for African researchers and international collaborators. The journal is committed to advancing knowledge and addressing challenges relevant to African contexts.",
  };

  return summaries[journalId] || defaultSummary;
}

// Fetch AI-recommended citations
export async function fetchRecommendedCitations(journalId: string): Promise<Recommendation[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data - recommended citations
  const recommendations: Recommendation[] = [
    {
      id: "rec-1",
      title: "Emerging Trends in African Academic Publishing: A Systematic Review",
      authors: ["Amina Osei", "Robert Mwangi"],
      journal: "Journal of Scholarly Communication",
      year: 2023,
    },
    {
      id: "rec-2",
      title: "Digital Transformation of Academic Journals in Sub-Saharan Africa",
      authors: ["James Wilson", "Grace Mensah"],
      journal: "Digital Library Perspectives",
      year: 2022,
    },
    {
      id: "rec-3",
      title: "Citation Patterns and Impact Factors of African Journals: A Comparative Analysis",
      authors: ["Elizabeth Muthoni", "Daniel Kipchoge"],
      journal: "Scientometrics",
      year: 2021,
    },
  ];

  return recommendations;
}

// Fetch AI trend analysis data
export async function fetchAITrends(query?: string, thematicArea?: string): Promise<TrendData> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Mock data - AI trend analysis
  const trendData: TrendData = {
    publicationTrends: [
      { year: 2018, count: 120 },
      { year: 2019, count: 145 },
      { year: 2020, count: 180 },
      { year: 2021, count: 210 },
      { year: 2022, count: 260 },
      { year: 2023, count: 320 },
    ],
    citationTrends: [
      { year: 2018, count: 350 },
      { year: 2019, count: 420 },
      { year: 2020, count: 580 },
      { year: 2021, count: 780 },
      { year: 2022, count: 950 },
      { year: 2023, count: 1250 },
    ],
    hotTopics: [
      { name: "Climate Resilience", growth: 78 },
      { name: "Digital Health", growth: 65 },
      { name: "Food Security", growth: 52 },
      { name: "Renewable Energy", growth: 48 },
      { name: "AI in Education", growth: 45 },
      { name: "Urban Planning", growth: 38 },
    ],
    insights: {
      publications: "Publications have increased by 38% in the past year",
      citations: "Citation impact has grown by 31% since 2022",
      topics: "Climate Resilience is the fastest growing research area",
    },
  };

  // Customize based on thematic area if provided
  if (thematicArea === "Medicine" || thematicArea === "Health Sciences") {
    trendData.hotTopics = [
      { name: "COVID-19 Long-term Effects", growth: 85 },
      { name: "Telemedicine", growth: 72 },
      { name: "Tropical Diseases", growth: 58 },
      { name: "Mental Health", growth: 52 },
      { name: "Healthcare Access", growth: 47 },
      { name: "Maternal Health", growth: 41 },
    ];
    trendData.insights.topics = "COVID-19 research continues to dominate medical publications";
  } else if (thematicArea === "Agriculture") {
    trendData.hotTopics = [
      { name: "Drought-resistant Crops", growth: 82 },
      { name: "Sustainable Farming", growth: 75 },
      { name: "Food Security", growth: 67 },
      { name: "Agricultural Technology", growth: 59 },
      { name: "Soil Health", growth: 48 },
      { name: "Livestock Management", growth: 42 },
    ];
    trendData.insights.topics = "Drought-resistant crop research has seen significant growth";
  }

  return trendData;
}

// Process voice search query
export async function processVoiceSearch(): Promise<{ transcript: string }> {
  // Simulate API call to process audio and return transcript
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data - simulated transcription result
  const possibleTranscripts = [
    "African journals on climate change adaptation",
    "Recent medical research in Kenya",
    "Agricultural sustainability in West Africa",
    "Educational technology journals in Africa",
    "Public health interventions in Sub-Saharan Africa",
  ];

  // Return a random transcript from our options
  const randomIndex = Math.floor(Math.random() * possibleTranscripts.length);
  return { transcript: possibleTranscripts[randomIndex] };
}
