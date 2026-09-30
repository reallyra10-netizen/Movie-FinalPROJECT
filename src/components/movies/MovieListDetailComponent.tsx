'use client';

//movie detail container
import React, { useEffect, useState } from 'react';
import MovieDetailComponent, { MovieDetailType } from './MovieDetailComponent';

type MovieIDProps = {
  id: number;
};

export default function MovieListDetailComponent(props: MovieIDProps) {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //fetch all real movie details from tmdb api
  useEffect(() => {
    async function fetchAllMovieDetails() {
      setLoading(true);
      setError(null);
      try {
        const apiKey = '0e42297fbdb49b4a24879c7d54325351';

        //fetch detail, videos, credits simultaneously
        const [detailRes, videoRes, creditRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${props.id}?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${props.id}/videos?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${props.id}/credits?api_key=${apiKey}`),
        ]);

        if (!detailRes.ok) {
          throw new Error('Movie not found');
        }

        const detailData = await detailRes.json();

        //extract real youtube trailer
        let trailerKey = null;
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const trailer = videoData.results?.find(
            (v: { site: string; type: string; key: string }) =>
              v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer) {
            trailerKey = trailer.key;
          }
        }

        //extract real director and top cast from tmdb credits
        let director = null;
        let cast = [];
        if (creditRes.ok) {
          const creditData = await creditRes.json();
          const directorObj = creditData.crew?.find(
            (c: { job: string; name: string }) => c.job === 'Director'
          );
          if (directorObj) {
            director = directorObj.name;
          }

          if (creditData.cast && Array.isArray(creditData.cast)) {
            cast = creditData.cast.slice(0, 8);
          }
        }

        //combine all real api details
        setMovie({
          ...detailData,
          trailerKey: trailerKey,
          director: director,
          cast: cast,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (props.id) {
      fetchAllMovieDetails();
    }
  }, [props.id]);

  //loading state
  if (loading) {
    return (
      <div className="py-32 text-center bg-[#141414]">
        <div className="inline-block w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading verified movie data from TMDB API...</p>
      </div>
    );
  }

  //error state
  if (error || !movie) {
    return (
      <div className="py-32 text-center bg-[#141414]">
        <p className="text-[#E50914] font-bold text-lg">{error || 'Movie not found.'}</p>
        <a href="/movies" className="inline-block mt-4 text-gray-400 hover:text-white underline text-sm">
          Return to Movies
        </a>
      </div>
    );
  }

  //render details
  return (
    <MovieDetailComponent
      id={movie.id}
      title={movie.title}
      poster_path={movie.poster_path}
      backdrop_path={movie.backdrop_path}
      overview={movie.overview}
      vote_average={movie.vote_average}
      vote_count={movie.vote_count}
      release_date={movie.release_date}
      tagline={movie.tagline}
      runtime={movie.runtime}
      status={movie.status}
      genres={movie.genres}
      budget={movie.budget}
      revenue={movie.revenue}
      original_language={movie.original_language}
      popularity={movie.popularity}
      production_companies={movie.production_companies}
      director={movie.director}
      cast={movie.cast}
      trailerKey={movie.trailerKey}
    />
  );
}
