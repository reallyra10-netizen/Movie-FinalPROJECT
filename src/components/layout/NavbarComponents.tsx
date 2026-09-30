'use client';

//navbar
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavbarComponents() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  //handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/movies?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#E50914] group-hover:scale-105 transition-transform duration-200">
                ISTAD<span className="text-white">MOVIES</span>
              </span>
            </Link>

            {/* desktop links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/movies?category=now_playing"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                Now Playing
              </Link>
              <Link
                href="/movies?category=popular"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                Popular
              </Link>
              <Link
                href="/movies?category=top_rated"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                Top Rated
              </Link>
              <Link
                href="/movies?category=upcoming"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                Upcoming
              </Link>
              <Link
                href="/about"
                className="text-gray-200 hover:text-[#E50914] transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* search bar */}
          <div className="hidden sm:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 lg:w-64 bg-neutral-900 border border-neutral-700 rounded-full py-1.5 pl-4 pr-10 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#E50914] transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E50914]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <Link
              href="/movies"
              className="bg-[#E50914] hover:bg-[#b81d24] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md transition-colors shadow-md"
            >
              Explore Now
            </Link>
          </div>

          {/* mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-neutral-800 py-4 space-y-3">
            <form onSubmit={handleSearch} className="px-2">
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md py-2 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#E50914]"
              />
            </form>
            <div className="flex flex-col space-y-2 px-2 text-sm">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                Home
              </Link>
              <Link
                href="/movies?category=now_playing"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                Now Playing
              </Link>
              <Link
                href="/movies?category=popular"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                Popular
              </Link>
              <Link
                href="/movies?category=top_rated"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                Top Rated
              </Link>
              <Link
                href="/movies?category=upcoming"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                Upcoming
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-gray-200 hover:text-[#E50914] py-1"
              >
                About
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
