'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import MovieComponent, { MovieType } from "./MovieComponent";

export default function MovieListComponent() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchingData() {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=0e42297fbdb49b4a24879c7d54325351"
        );
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchingData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-lg">Fetching cinema movies...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Now Showing & Popular Movies
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Click on any movie to view storyline details and book hall seats.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
          {movies.length} Movies Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((item) => (
          <Link key={item.id} href={`/movies/${item.id}`} className="group h-full">
            <MovieComponent
              id={item.id}
              title={item.title}
              poster_path={item.poster_path}
              overview={item.overview}
              vote_average={item.vote_average}
              release_date={item.release_date}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
