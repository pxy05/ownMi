"use client";

import React from "react";
import { useAppUser } from "@/lib/app-user-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateUserCard from "@/components/ui-support/CreateUserCard";

const LeaderboardPage = () => {
  const { appUser, loading, exists, error } = useAppUser();

  if (loading)
    return <div className="text-center p-8">Loading user data...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!exists) return <CreateUserCard />;
  if (!appUser) return <div className="text-center p-8">No user data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            {appUser.show_in_leaderboards
              ? "You are visible on the leaderboard"
              : "You have opted out of leaderboard visibility"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-xl font-bold">{appUser.username}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-xl font-bold">${appUser.total_currency}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Current Salary
                  </p>
                  <p className="text-xl font-bold">${appUser.current_salary}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Leaderboard Status
                  </p>
                  <p className="text-xl font-bold">
                    {appUser.show_in_leaderboards ? "Visible" : "Hidden"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Global Leaderboard</h3>
              <div className="text-muted-foreground text-center py-8">
                Leaderboard data will be implemented here...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
