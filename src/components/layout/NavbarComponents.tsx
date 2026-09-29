"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NavbarComponents() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the small menu when the user clicks somewhere else
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          {/* Clicking the logo opens the main menu */}
          <div className="relative flex shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center cursor-pointer focus:outline-none"
              title="Menu & Settings"
            >
              <img
                className="h-7 w-auto transition-transform hover:scale-105"
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Logo"
              />
              <p className="sr-only">Website Title</p>
            </button>

            {/* Small dropdown menu under the logo */}
            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-3 w-52 rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Menu & Settings
                  </p>
                </div>

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <span>🏠</span> Home
                </Link>

                <Link
                  href="/movies"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <span>🎬</span> Movies
                </Link>

                <div className="border-t border-gray-100 my-1 pt-1">
                  <Link
                    href="/dashboard/users"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>Users Database</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      DB
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main navigation links */}
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <Link
              aria-current="page"
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="/movies"
            >
              Movies
            </Link>
            <Link
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#"
            >
              How it works
            </Link>
            <Link
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#"
            >
              Pricing
            </Link>
          </div>

          {/* Login and signup buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link
              className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href="/signup"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
