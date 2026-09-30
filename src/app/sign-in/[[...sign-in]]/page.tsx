//sign-in page
import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

//metadata
export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ISTADMOVIES account with Google or email.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4">
      <SignIn />
    </div>
  );
}
