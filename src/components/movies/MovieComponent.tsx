import Image from "next/image";

export type MovieType = {
  id?: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
};

export default function MovieComponent(props: MovieType) {
  const imageUrl = props.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group-hover:-translate-y-1">
      <div className="relative w-full h-80 bg-slate-950 overflow-hidden">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageUrl}
          alt={props.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
          <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {props.vote_average ? props.vote_average.toFixed(1) : "N/A"}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between text-slate-100">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {props.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Release: {props.release_date || "Unknown"}
          </p>
          <p className="text-slate-300 text-xs mt-3 line-clamp-3 leading-relaxed">
            {props.overview || "No description available."}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Click to Book
          </span>
          <span className="bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition duration-200">
            View & Book →
          </span>
        </div>
      </div>
    </div>
  );
}
