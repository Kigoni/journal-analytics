// Base interface for common ID and name structure
interface IdName {
  id: number;
  [key: string]: string | number; // Flexible to accommodate "language", "platform", etc.
}

// Interface for Language
interface Language extends IdName {
  language: string;
}

// Interface for Platform
interface Platform extends IdName {
  platform: string;
}

// Interface for Country
interface Country extends IdName {
  country: string;
}

// Interface for Thematic Area
interface ThematicArea extends IdName {
  thematic_area: string;
}

// Interface for Article
export interface Article {
  id: number;
  title: string;
  authors: string;
  publisher: string;
  publication_date: string; // ISO date string (e.g., "2020-06-30")
  doi: string;
  license_url: string | null;
  electronic_issn: string | null;
  print_issn: string | null;
  article_type: string;
  pdf: string | null;
  journal: string;
  volume_number: string;
  volume_issue_number: string;
  volume_year: string;
  country: string;
  language: string;
  thematic_area: string;
  reference_count: number;
  citation_count: number;
  abstract: string;
}

// Interface for Volume
export interface Volume {
  id: number;
  volume_number: number | string; // Some are numbers, some are strings in the data
  issue_number: number | string;
  year: number;
  articles: Article[];
}

// Interface for Journal
export interface Journal {
  id: number;
  language: Language;
  platform: Platform;
  country: Country;
  thematic_area: ThematicArea;
  volumes: Volume[];
  articles: Article[]; // Empty in the sample, but included for completeness
  image: string | null;
  journal_title: string;
  publishers_name: string;
  issn_number: string | null;
  link: string;
  aim_identifier: boolean;
  medline: boolean | null;
  google_scholar_index: boolean;
  impact_factor: number | null;
  sjr: boolean;
  h_index: number | null;
  eigen_factor: number | null;
  eigen_metrix: string; // "nan" or potentially a number
  snip: boolean;
  snip_metrix: number | null;
  open_access_journal: boolean;
  listed_in_doaj: boolean;
  present_issn: boolean;
  publisher_in_cope: boolean;
  online_publisher_africa: boolean;
  hosted_on_inasps: boolean;
  summary: string;
  user: string | null;
}

// Interface for the full API response
interface JournalsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Journal[];
}

export default JournalsApiResponse;
