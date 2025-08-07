"use client";

import CreateUserCard from "@/components/ui-support/CreateUserCard";
import { useAppUser } from "@/lib/app-user-context";
import { useAuth } from "@/lib/auth-context";
import LandingNoUser from "@/components/user-pages/landing-page-no-user";
import LandingWithUser from "@/components/user-pages/landing-page-user";

export default function Home() {
  const { appUser, loading: appUserLoading, exists, error } = useAppUser();
  const { user, loading: authLoading } = useAuth();

  // If no authenticated user, immediately show landing page for non-users
  if (!authLoading && !user) return <LandingNoUser />;

  // Show loading while either auth or app user data is being fetched
  if (authLoading || appUserLoading)
    return (
      <div className="text-center p-8 text-4xl font-bold">
        Loading user data...
      </div>
    );

  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  if (exists && user) return <LandingWithUser />;
  if (!exists && user) return <CreateUserCard />;

  // Fallback to no user landing page
  return <LandingNoUser />;
}
