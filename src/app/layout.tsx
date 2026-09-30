//layout
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import NavbarComponents from "@/components/layout/NavbarComponents";
import FooterComponents from "@/components/layout/FooterComponents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://istadmovies.vercel.app"),
  title: {
    template: "%s | ISTADMOVIES",
    default: "ISTADMOVIES - Watch Movies",
  },
  description: "Browse popular movies, top rated films, and now playing cinema titles with TMDB data, storyline overviews, trailers, and cast information.",
  keywords: ["movies", "cinema", "tmdb", "trending movies", "top rated", "trailers", "netflix style", "istadmovies"],
  openGraph: {
    title: "ISTADMOVIES - Watch Movies Online",
    description: "Discover the best trending movies, top rated films, and trailers online.",
    siteName: "ISTADMOVIES",
    type: "website",
  },
};

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

//root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <NavbarComponents />
      <main className="flex-1">
        {children}
      </main>
      <FooterComponents />
    </>
  );

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-screen flex flex-col bg-[#141414] text-white">
        {hasClerkKey ? <ClerkProvider>{inner}</ClerkProvider> : inner}
      </body>
    </html>
  );
}
