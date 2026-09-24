import { Metadata } from "next";
import MovieListComponent from "@/components/movies/MovieListComponent";

export const metadata: Metadata = {
  title: "Watch.ME - Browse Popular Movies & Book Seats",
  description: "Discover the latest trending movies, view storyline details, trailer summaries, and reserve your cinema hall seats online.",
  keywords: "movies, cinema, ticket booking, tmdb, trending films, movie seats",
  openGraph: {
    title: "Watch.ME - Browse Popular Movies & Book Seats",
    description: "Discover the latest trending movies and reserve your cinema hall seats online.",
    images: ["/Thumbernail.jpg"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <MovieListComponent />
    </main>
  );
}
