//footer
import React from 'react';
import Link from 'next/link';

export default function FooterComponents() {
  return (
    <footer className="bg-[#0b0b0b] border-t border-neutral-800 text-gray-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* brand and info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-wider text-[#E50914]">
                ISTAD<span className="text-white">MOVIES</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your ultimate destination for discovering trending movies, reviews, trailers, and ratings powered by TMDB API.
            </p>
          </div>

          {/* navigation links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#E50914] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-[#E50914] transition-colors">
                  All Movies
                </Link>
              </li>
              <li>
                <Link href="/movies?category=popular" className="hover:text-[#E50914] transition-colors">
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link href="/movies?category=top_rated" className="hover:text-[#E50914] transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/movies?category=upcoming" className="hover:text-[#E50914] transition-colors">
                  Upcoming Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* movie categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Genres
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Action & Adventure
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Animation & Family
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Comedy & Romance
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Sci-Fi & Fantasy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Horror & Thriller
                </span>
              </li>
            </ul>
          </div>

          {/* api info and disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Data Attribution
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>

        </div>

        {/* copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ISTADMOVIES. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About Us
            </Link>
            <Link href="/movies" className="hover:text-gray-300 transition-colors">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
