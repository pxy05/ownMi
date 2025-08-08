"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function SignIn() {
  const supabase = createClient();

  const handleGitHubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <Button onClick={handleGitHubSignIn} className="w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/github-mark.svg"
              alt="GitHub"
              width={20}
              height={20}
              className="w-5 h-5 dark:invert"
            />
            Sign in with GitHub
          </div>
        </Button>
      </div>
    </div>
  );
}
