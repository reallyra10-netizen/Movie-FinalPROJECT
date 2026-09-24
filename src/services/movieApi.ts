import {
  Movie,
  TMDBResponse,
  MovieDetail,
  MovieCredits,
  MovieVideosResponse,
  MovieCategory,
} from '@/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '0e42297fbdb49b4a24879c7d54325351';
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// Image helpers
export const getPosterUrl = (path: string | null, size: 'w342' | 'w500' | 'original' = 'w500') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-poster.png';

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-backdrop.png';

// Generic Fetcher
async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const query = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const url = `${BASE_URL}${endpoint}?${query.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour with ISR
  });

  if (!res.ok) {
    throw new Error(`TMDB API error (${res.status}): ${res.statusText}`);
  }

  return res.json();
}

// 1. Movie Lists (Popular, Now Playing, Top Rated, Upcoming)
export async function getMoviesByCategory(
  category: MovieCategory = 'popular',
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/movie/${category}`, { page });
}

// 2. Trending Movies
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day'
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
}

// 3. Movie Details
export async function getMovieDetail(movieId: number | string): Promise<MovieDetail> {
  return fetchTMDB<MovieDetail>(`/movie/${movieId}`);
}

// 4. Movie Credits (Cast & Crew)
export async function getMovieCredits(movieId: number | string): Promise<MovieCredits> {
  return fetchTMDB<MovieCredits>(`/movie/${movieId}/credits`);
}

// 5. Movie Videos (Trailers & Teasers)
export async function getMovieVideos(movieId: number | string): Promise<MovieVideosResponse> {
  return fetchTMDB<MovieVideosResponse>(`/movie/${movieId}/videos`);
}

// 6. Search Movies
export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/search/movie`, { query, page });
}
