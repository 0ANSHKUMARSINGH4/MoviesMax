export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: Genre[];
  runtime?: number;
  vote_count?: number;
  credit_id?: string;
  character?: string;
  department?: string;
  job?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: Cast[];
  crew: Crew[];
}

export interface MovieDetailsResponse extends Movie {
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  credits: MovieCredits;
  similar: {
    results: Movie[];
  };
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}