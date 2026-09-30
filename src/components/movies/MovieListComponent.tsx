'use client';

//movie list
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MovieComponent from './MovieComponent';
import { Movie } from '@/types/movie';

type MovieListProps = {
  initialCategory?: 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
  searchQuery?: string;
};

export default function MovieListComponent(props: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>(props.initialCategory || 'popular');
  const [query, setQuery] = useState<string>(props.searchQuery || '');

  //fetch movies from tmdb api
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const apiKey = '0e42297fbdb49b4a24879c7d54325351';
        let url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`;

        if (query.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query.trim())}&api_key=${apiKey}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [category, query]);

  //sync search query from props
  useEffect(() => {
    if (props.searchQuery !== undefined) {
      setQuery(props.searchQuery);
    }
  }, [props.searchQuery]);

  //category switch handler
  const handleCategoryChange = (newCat: string) => {
    setQuery('');
    setCategory(newCat);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-7 bg-[#E50914] rounded-sm inline-block" />
            {query.trim()
              ? `Search Results for "${query}"`
              : category === 'popular'
              ? 'Trending & Popular Movies'
              : category === 'now_playing'
              ? 'Now Playing in Theaters'
              : category === 'top_rated'
              ? 'Top Rated of All Time'
              : 'Upcoming Releases'}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Explore live titles, reviews, and storylines powered by TMDB.
          </p>
        </div>

        {/* category buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'popular', label: 'Popular' },
            { id: 'now_playing', label: 'Now Playing' },
            { id: 'top_rated', label: 'Top Rated' },
            { id: 'upcoming', label: 'Upcoming' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat.id && !query.trim()
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/40'
                  : 'bg-neutral-800/80 text-gray-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* loading state */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading movies from TMDB API...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center bg-neutral-900/50 rounded-xl border border-neutral-800 mt-8">
          <p className="text-gray-300 font-semibold text-lg">No movies found</p>
          <p className="text-gray-500 text-xs mt-1">Try another keyword or category.</p>
        </div>
      ) : (
        /* movie cards grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <MovieComponent
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                overview={movie.overview}
                vote_average={movie.vote_average}
                release_date={movie.release_date}
                genre_ids={movie.genre_ids}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
