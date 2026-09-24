'use client';

import { useEffect, useState } from "react";
import MovieDetailComponent, { MovieDetailType } from "./MovieDetailComponent";

type MovieIDType = {
  id: number;
};

export default function MovieListDetailComponent({ id }: MovieIDType) {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchingData() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=0e42297fbdb49b4a24879c7d54325351`
        );
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchingData();
    }
  }, [id]);

  if (loading) return <p className="p-10 text-center text-lg">Loading movie details...</p>;
  if (!movie) return <p className="p-10 text-center text-lg text-red-500">Movie not found.</p>;

  return (
    <MovieDetailComponent
      title={movie.title}
      poster_path={movie.poster_path}
      backdrop_path={movie.backdrop_path}
      overview={movie.overview}
      vote_average={movie.vote_average}
      release_date={movie.release_date}
      tagline={movie.tagline}
      runtime={movie.runtime}
      genres={movie.genres}
    />
  );
}
