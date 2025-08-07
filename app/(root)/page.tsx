"use client";

import CreateUserCard from "@/components/ui-support/CreateUserCard";
import { useAppUser } from "@/lib/app-user-context";
import { useAuth } from "@/lib/auth-context";
import LandingNoUser from "@/components/user-pages/landing-page-no-user";

export default function Home() {
  const { appUser, loading, exists, error } = useAppUser();
  const { user } = useAuth();
  console.log(appUser?.email);

  if (loading)
    return <div className="text-center p-8">Loading user data...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!exists && !user) return <LandingNoUser />;
  if (!exists && user) return <CreateUserCard />;
  if (exists && user) return null;
}
