//movie types

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult?: boolean;
  genre_ids?: number[];
  video?: boolean;
}

export interface TMDBResponse<T = Movie> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country?: string;
}

export interface MovieDetail extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  genres: Genre[];
  original_language?: string;
  production_companies?: ProductionCompany[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
