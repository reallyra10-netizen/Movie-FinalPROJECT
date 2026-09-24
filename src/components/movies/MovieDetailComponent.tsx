import Image from "next/image";
import Link from "next/link";
import MovieBookingCard from "@/components/MovieBookingCard";

export type MovieDetailType = {
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  tagline?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
};

export default function MovieDetailComponent(props: MovieDetailType) {
  const posterUrl = props.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const backdropUrl = props.backdrop_path
    ? `https://image.tmdb.org/t/p/original${props.backdrop_path}`
    : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
      >
        ← Back to Movies Catalog
      </Link>

      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-slate-100">
        {/* Backdrop Banner */}
        {backdropUrl && (
          <div className="relative w-full h-72 sm:h-96 bg-slate-950">
            <Image
              fill
              priority
              className="object-cover opacity-50"
              src={backdropUrl}
              alt={props.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start -mt-20 sm:-mt-32 relative z-10">
          {/* Movie Poster */}
          <div className="relative w-56 sm:w-64 h-80 sm:h-96 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700">
            <Image
              fill
              className="object-cover"
              src={posterUrl}
              alt={props.title}
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {props.title}
            </h1>

            {props.tagline && (
              <p className="text-indigo-300 italic mt-2 text-sm sm:text-base">
                "{props.tagline}"
              </p>
            )}

            {/* Badges / Details */}
            <div className="flex flex-wrap items-center gap-3 my-4">
              <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                ★ {props.vote_average ? props.vote_average.toFixed(1) : "N/A"} / 10
              </span>
              <span className="text-xs text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                Release: {props.release_date || "Unknown"}
              </span>
              {props.runtime && (
                <span className="text-xs text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                  Duration: {props.runtime} mins
                </span>
              )}
            </div>

            {/* Genres */}
            {props.genres && props.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {props.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-4">
              <h2 className="text-lg font-bold text-white mb-2">Storyline Overview</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base max-w-3xl">
                {props.overview || "No detailed overview available for this movie."}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Seat Booking Section */}
        <div className="p-6 sm:p-10 border-t border-slate-800 bg-slate-950/60">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-2xl font-extrabold text-white">Select & Book Hall Seats</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose your date, showtime, and hall seats for <span className="text-amber-400 font-bold">{props.title}</span>.
            </p>
          </div>

          <MovieBookingCard
            movieTitle={props.title}
            backdropPath={props.backdrop_path}
            posterPath={props.poster_path}
            runtime={props.runtime}
            voteAverage={props.vote_average}
            genres={props.genres}
          />
        </div>
      </div>
    </div>
  );
}
