'use client';

//navbar
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs';

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function NavbarComponents() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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

          {/* search bar and clerk auth */}
          <div className="hidden sm:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 lg:w-56 bg-neutral-900 border border-neutral-700 rounded-full py-1.5 pl-4 pr-10 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#E50914] transition-all"
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

            {/* clerk authentication */}
            {hasClerkKey ? (
              <>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="text-gray-300 hover:text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-[#E50914] hover:bg-[#b81d24] text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-md transition-colors shadow">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>

                <Show when="signed-in">
                  <div className="flex items-center gap-3 pl-2">
                    <UserButton />
                  </div>
                </Show>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-[#E50914] hover:bg-[#b81d24] text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-md transition-colors shadow flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign In with Google
              </button>
            )}
          </div>

          {/* mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            {hasClerkKey && (
              <Show when="signed-in">
                <UserButton />
              </Show>
            )}
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

              {/* mobile clerk auth */}
              {hasClerkKey ? (
                <Show when="signed-out">
                  <div className="pt-2 flex flex-col gap-2">
                    <SignInButton mode="modal">
                      <button className="w-full text-center bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full text-center bg-[#E50914] hover:bg-[#b81d24] text-white font-semibold py-2 rounded">
                        Sign Up with Google
                      </button>
                    </SignUpButton>
                  </div>
                </Show>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full text-center bg-[#E50914] hover:bg-[#b81d24] text-white font-semibold py-2 rounded mt-2"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* clerk key prompt modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181818] border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#E50914]" />
              <h3 className="text-lg font-bold">Connect Clerk Authentication</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              To enable live Google Sign-In and account management:
            </p>
            <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside bg-neutral-950 p-4 rounded-lg border border-neutral-800 font-mono">
              <li>Open <span className="text-[#E50914]">https://dashboard.clerk.com</span></li>
              <li>Create or select your project</li>
              <li>Copy <span className="text-amber-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span></li>
              <li>Add it to your <span className="text-white">.env.local</span> &amp; Vercel settings</li>
            </ol>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="bg-[#E50914] text-white text-xs font-semibold px-4 py-2 rounded hover:bg-[#b81d24]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
