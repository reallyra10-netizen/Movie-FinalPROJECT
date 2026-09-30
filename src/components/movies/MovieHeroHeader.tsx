//header hero
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';

export type MovieHeroProps = {
  movie?: Movie | null;
};

const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export default function MovieHeroHeader(props: MovieHeroProps) {
  if (!props.movie) {
    return null;
  }

  //backdrop and poster url
  const backdropUrl = props.movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${props.movie.backdrop_path}`
    : props.movie.poster_path
    ? `https://image.tmdb.org/t/p/original${props.movie.poster_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80';

  const releaseYear = props.movie.release_date ? props.movie.release_date.split('-')[0] : '';
  const primaryGenre = props.movie.genre_ids && props.movie.genre_ids.length > 0 && TMDB_GENRES[props.movie.genre_ids[0]]
    ? TMDB_GENRES[props.movie.genre_ids[0]]
    : null;

  return (
    <div className="relative w-full h-[55vh] min-h-[420px] max-h-[620px] bg-black overflow-hidden flex items-end">
      {/* backdrop image */}
      <Image
        src={backdropUrl}
        alt={props.movie.title || 'Featured Movie'}
        fill
        priority
        className="object-cover object-center opacity-60 scale-105 animate-fade-in"
      />

      {/* gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-black/40 to-transparent" />

      {/* hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="max-w-2xl space-y-4">
          
          {/* badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#E50914] text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              TMDB Featured
            </span>
            <span className="text-amber-400 font-bold text-xs sm:text-sm flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-amber-500/20">
              ★ {props.movie.vote_average ? props.movie.vote_average.toFixed(1) : 'N/A'}
            </span>
            {releaseYear && (
              <span className="text-gray-300 text-xs sm:text-sm bg-black/60 px-2 py-0.5 rounded border border-neutral-700">
                {releaseYear}
              </span>
            )}
            {primaryGenre && (
              <span className="text-[#E50914] text-xs font-semibold bg-black/60 px-2.5 py-0.5 rounded border border-[#E50914]/30">
                {primaryGenre}
              </span>
            )}
          </div>

          {/* title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
            {props.movie.title}
          </h1>

          {/* overview */}
          <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow">
            {props.movie.overview}
          </p>

          {/* call to actions */}
          <div className="pt-2 flex items-center gap-4">
            <Link
              href={`/movies/${props.movie.id}`}
              className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#b81d24] text-white text-sm font-bold px-6 py-3 rounded shadow-lg shadow-red-950/60 transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              View Movie Details
            </Link>

            <Link
              href="/movies"
              className="inline-flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white text-sm font-semibold px-5 py-3 rounded border border-neutral-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Browse All
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
