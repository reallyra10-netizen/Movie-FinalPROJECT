import { Metadata } from "next";
import MovieListComponent from "@/components/movies/MovieListComponent";

export const metadata: Metadata = {
  title: "Movies - Watch.ME",
  description: "Browse popular movies, explore ratings, descriptions, and details from TMDB.",
  keywords: "movies, cinema, tmdb, popular movies, film, stream",
  openGraph: {
    title: "Movies - Watch.ME",
    description: "Browse popular movies, explore ratings, descriptions, and details from TMDB.",
    images: ["/Thumbernail.jpg"],
  },
};

export default function MoviePage() {
  return (
    <section className="min-h-screen bg-gray-50 py-6">
      {/* Display all movie cards */}
      <MovieListComponent />
    </section>
  );
}
