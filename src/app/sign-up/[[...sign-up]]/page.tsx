//sign-up page
import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

//metadata
export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an ISTADMOVIES account to save favorites and track your watchlist.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4">
      <SignUp />
    </div>
  );
}
