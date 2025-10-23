"use client";

import React from "react";
import { useAppUser } from "@/lib/app-user-context";
import LeaderBoardCard from "@/components/ui-support/LeaderBoardCard";

const LeaderboardPage = () => {
  const { loading, error } = useAppUser();

  if (loading)
    return <div className="text-center p-8">Loading user data...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <LeaderBoardCard />
  );
};

export default LeaderboardPage;
