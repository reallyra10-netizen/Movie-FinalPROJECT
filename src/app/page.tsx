//home page
import { Metadata } from "next";
import MovieHeroHeader from "@/components/movies/MovieHeroHeader";
import MovieListComponent from "@/components/movies/MovieListComponent";

//seo metadata
export const metadata: Metadata = {
  title: "Home",
  description: "Explore the latest popular movies, trending cinema hits, storyline summaries, and ratings powered by TMDB.",
  keywords: ["movies", "cinema", "tmdb", "trending films", "top rated", "netflix style"],
  openGraph: {
    title: "Home | ISTADMOVIES",
    description: "Explore the latest popular movies, trending cinema hits, and ratings.",
    images: ["/Thumbernail.jpg"],
  },
};

//fetch hero movie from api
async function getHeroMovie() {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=0e42297fbdb49b4a24879c7d54325351",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error("Hero movie error:", error);
    return null;
  }
}

export default async function Home() {
  const heroMovie = await getHeroMovie();

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      {/* hero header */}
      <MovieHeroHeader movie={heroMovie} />

      {/* movie catalog */}
      <MovieListComponent initialCategory="popular" />
    </div>
  );
}
