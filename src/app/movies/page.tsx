//movies catalog page
import { Metadata } from "next";
import MovieListComponent from "@/components/movies/MovieListComponent";

type PageProps = {
  searchParams: Promise<{
    category?: 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
    search?: string;
  }>;
};

//dynamic seo metadata matching navbar page name
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.searchParams;

  let pageName = "All Movies";
  if (params.search) {
    pageName = `Search: ${params.search}`;
  } else if (params.category === "popular") {
    pageName = "Popular";
  } else if (params.category === "top_rated") {
    pageName = "Top Rated";
  } else if (params.category === "upcoming") {
    pageName = "Upcoming";
  } else if (params.category === "now_playing") {
    pageName = "Now Playing";
  }

  return {
    title: pageName,
    description: `Explore ${pageName} on ISTADMOVIES powered by TMDB live data.`,
    keywords: ["movies", pageName.toLowerCase(), "tmdb", "streaming", "istadmovies"],
    openGraph: {
      title: `${pageName} | ISTADMOVIES`,
      description: `Explore ${pageName} on ISTADMOVIES powered by TMDB live data.`,
      images: ["/Thumbernail.jpg"],
    },
  };
}

export default async function MoviePage(props: PageProps) {
  const params = await props.searchParams;

  return (
    <div className="min-h-screen bg-[#141414] text-white py-6">
      <MovieListComponent
        initialCategory={params.category || 'popular'}
        searchQuery={params.search || ''}
      />
    </div>
  );
}
