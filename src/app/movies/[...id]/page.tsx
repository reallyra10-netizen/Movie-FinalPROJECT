import { Metadata } from "next";
import MovieListDetailComponent from "@/components/movies/MovieListDetailComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movieId = id[0];

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=0e42297fbdb49b4a24879c7d54325351`
    );
    const movie = await response.json();

    return {
      title: `${movie.title || "Movie Details"} - Book Seats | Watch.ME`,
      description: movie.overview || "Discover movie details, ratings, and book your hall seats.",
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : ["/Thumbernail.jpg"],
      },
    };
  } catch (error) {
    return {
      title: "Movie Booking & Details - Watch.ME",
      description: "Discover movie details and book hall seats on Watch.ME",
    };
  }
}

export default async function DetailMoviePage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id } = await params;
  const movieId = Number(id[0]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <MovieListDetailComponent id={movieId} />
    </main>
  );
}
