import React from "react";
import SignIn from "@/components/auth/sign-in";
import { auth } from "@/auth";

export default async function githubLogin() {
  const session = await auth();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {session?.user ? (
          <p className="text-muted-foreground">You are already signed in.</p>
        ) : (
          <SignIn />
        )}
      </main>
    </div>
  );
}
