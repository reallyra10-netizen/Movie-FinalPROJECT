//about page
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

//seo metadata
export const metadata: Metadata = {
  title: "About",
  description: "Learn about ISTADMOVIES, a modern Netflix-inspired front-end movie discovery application powered by TMDB API.",
  keywords: ["about istadmovies", "about", "movie streaming", "tmdb api", "cinema", "netflix clone style"],
  openGraph: {
    title: "About | ISTADMOVIES",
    description: "Learn about ISTADMOVIES, a modern Netflix-inspired front-end movie discovery web application.",
    images: ["/Thumbernail.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-black text-[#E50914] bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Welcome to <span className="text-[#E50914]">ISTADMOVIES</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            A modern, responsive front-end movie discovery platform inspired by Netflix's sleek interface, powered by the TMDB v3 API.
          </p>
        </div>

        {/* project features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#181818] p-6 rounded-xl border border-neutral-800 hover:border-[#E50914] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-[#E50914] mb-4">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Live TMDB Data</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Real-time movies fetched directly from The Movie Database (TMDB) with up-to-date posters, ratings, and synopses.
            </p>
          </div>

          <div className="bg-[#181818] p-6 rounded-xl border border-neutral-800 hover:border-[#E50914] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-[#E50914] mb-4">
              <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Search & Filter</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Instant movie search and easy category filtering across Popular, Now Playing, Top Rated, and Upcoming titles.
            </p>
          </div>

          <div className="bg-[#181818] p-6 rounded-xl border border-neutral-800 hover:border-[#E50914] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-[#E50914] mb-4">
              <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Netflix Aesthetic</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Cinematic dark design featuring crisp contrast, crimson highlights, smooth hover animations, and video trailers.
            </p>
          </div>
        </div>

        {/* platform info section */}
        <div className="bg-[#181818] rounded-2xl p-8 border border-neutral-800 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#E50914] rounded-sm" />
            Platform Overview
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            ISTADMOVIES is a cinema streaming discovery platform engineered with modern web technologies, real-time TMDB API synchronization, high-definition trailer playback, and responsive dark aesthetics.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-800 text-center">
            <div className="bg-neutral-900 p-4 rounded-lg">
              <span className="text-[#E50914] font-black text-xl">Next.js 16</span>
              <p className="text-gray-400 text-xs mt-1">App Router</p>
            </div>
            <div className="bg-neutral-900 p-4 rounded-lg">
              <span className="text-[#E50914] font-black text-xl">React 19</span>
              <p className="text-gray-400 text-xs mt-1">UI Library</p>
            </div>
            <div className="bg-neutral-900 p-4 rounded-lg">
              <span className="text-[#E50914] font-black text-xl">TMDB API</span>
              <p className="text-gray-400 text-xs mt-1">v3 Endpoint</p>
            </div>
            <div className="bg-neutral-900 p-4 rounded-lg">
              <span className="text-[#E50914] font-black text-xl">Tailwind</span>
              <p className="text-gray-400 text-xs mt-1">Modern Styling</p>
            </div>
          </div>

          <div className="pt-6 text-center">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#b81d24] text-white text-sm font-bold px-6 py-3 rounded-lg shadow-lg shadow-red-950/50 transition-all hover:scale-105"
            >
              Start Exploring Movies →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
