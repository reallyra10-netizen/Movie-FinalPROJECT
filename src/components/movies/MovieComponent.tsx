//movie card
import React from 'react';
import Image from 'next/image';

export type MovieCardProps = {
  id?: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  genre_ids?: number[];
};

//tmdb genre mapping from api
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

export default function MovieComponent(props: MovieCardProps) {
  //poster image url
  const posterUrl = props.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

  //extract release year
  const releaseYear = props.release_date ? props.release_date.split('-')[0] : 'N/A';

  //extract primary genre from tmdb api
  const primaryGenre = props.genre_ids && props.genre_ids.length > 0 && TMDB_GENRES[props.genre_ids[0]]
    ? TMDB_GENRES[props.genre_ids[0]]
    : null;

  return (
    <div className="group relative bg-[#181818] rounded-lg overflow-hidden border border-neutral-800 hover:border-[#E50914] transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 hover:-translate-y-1.5 flex flex-col h-full">
      {/* poster image */}
      <div className="relative w-full aspect-[2/3] bg-neutral-900 overflow-hidden">
        <Image
          src={posterUrl}
          alt={props.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />

        {/* hd quality badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-[#E50914] text-[10px] font-black px-2 py-0.5 rounded border border-[#E50914]/40 tracking-wider">
          HD
        </div>

        {/* year & genre badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-gray-300 text-xs font-semibold px-2 py-1 rounded border border-neutral-700 flex items-center gap-1.5">
          <span>{releaseYear}</span>
          {primaryGenre && (
            <>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-[#E50914] text-[11px] font-medium">{primaryGenre}</span>
            </>
          )}
        </div>
      </div>

      {/* card info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-white text-base group-hover:text-[#E50914] transition-colors line-clamp-1">
            {props.title}
          </h3>

          <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {props.overview || 'No storyline summary available.'}
          </p>
        </div>

        {/* card footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>★</span>
            <span>{props.vote_average ? props.vote_average.toFixed(1) : 'N/A'}</span>
            <span className="text-gray-500 font-normal text-[10px]">/ 10</span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#E50914] group-hover:bg-[#b81d24] text-white font-semibold px-3 py-1.5 rounded transition-colors">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Details
          </span>
        </div>
      </div>
    </div>
  );
}
