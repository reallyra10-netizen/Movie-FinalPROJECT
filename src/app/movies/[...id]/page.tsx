//movie details page
import { Metadata } from "next";
import MovieListDetailComponent from "@/components/movies/MovieListDetailComponent";

type DetailPageProps = {
  params: Promise<{ id: string[] }>;
};

//dynamic seo metadata
export async function generateMetadata(props: DetailPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const movieId = id ? id[0] : "";

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=0e42297fbdb49b4a24879c7d54325351`
    );
    if (!res.ok) {
      return {
        title: "Movie Details",
        description: "Explore storyline, rating, and trailer details on ISTADMOVIES.",
      };
    }

    const movie = await res.json();

    return {
      title: movie.title || "Movie Details",
      description: movie.overview || `Watch trailer and discover details for ${movie.title}.`,
      openGraph: {
        title: `${movie.title || "Movie Details"} | ISTADMOVIES`,
        description: movie.overview || "Discover movie details and official trailers.",
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : ["/Thumbernail.jpg"],
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Movie Details",
      description: "Discover movie ratings and trailers on ISTADMOVIES.",
    };
  }
}

export default async function DetailMoviePage(props: DetailPageProps) {
  const { id } = await props.params;
  const movieId = Number(id ? id[0] : 0);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <MovieListDetailComponent id={movieId} />
    </div>
  );
}
