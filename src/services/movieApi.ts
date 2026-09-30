//movie api service
import {
  Movie,
  TMDBResponse,
  MovieDetail,
  MovieCredits,
  MovieVideosResponse,
  MovieCategory,
} from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '0e42297fbdb49b4a24879c7d54325351';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

//image helper urls
export const getPosterUrl = (path: string | null, size: 'w342' | 'w500' | 'original' = 'w500') =>
  path
    ? `${IMAGE_BASE_URL}/${size}${path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original') =>
  path
    ? `${IMAGE_BASE_URL}/${size}${path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80';

//fetch helper
async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const query = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const url = `${BASE_URL}${endpoint}?${query.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB error (${res.status}): ${res.statusText}`);
  }

  return res.json();
}

//movies by category
export async function getMoviesByCategory(
  category: MovieCategory = 'popular',
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/movie/${category}`, { page });
}

//trending movies
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day'
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
}

//movie details
export async function getMovieDetail(movieId: number | string): Promise<MovieDetail> {
  return fetchTMDB<MovieDetail>(`/movie/${movieId}`);
}

//movie credits
export async function getMovieCredits(movieId: number | string): Promise<MovieCredits> {
  return fetchTMDB<MovieCredits>(`/movie/${movieId}/credits`);
}

//movie trailers
export async function getMovieVideos(movieId: number | string): Promise<MovieVideosResponse> {
  return fetchTMDB<MovieVideosResponse>(`/movie/${movieId}/videos`);
}

//search movies
export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/search/movie`, { query, page });
}
