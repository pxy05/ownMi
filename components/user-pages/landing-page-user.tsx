import React from "react";
import FocusCard from "@/components/ui/focus-card";
import StatisticsCard from "@/components/ui/statistics-card";
import CareerCard from "@/components/ui/career-card";
import { useAppUser } from "@/lib/app-user-context";

const LandingWithUser = () => {
  const { appUser } = useAppUser();

  return (
    <div>
      <div className="text-center w-full mb-16">
        <h1 className="font-[800] text-4xl inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 dark:from-primary dark:via-blue-400 dark:to-primary">
          Welcome back, {appUser?.username}!
        </h1>
      </div>

      <div className="flex items-center gap-4 w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <FocusCard />
          <StatisticsCard />
          <CareerCard />
        </div>
      </div>
    </div>
  );
};

export default LandingWithUser;
