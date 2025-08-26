"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useAppUser } from "@/lib/app-user-context";
import { useAuth } from "@/lib/auth-context";
import ChartAreaGradient from "@/components/ui-support/focus-chart";
import { useTheme } from "next-themes";

const page = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const {
    focusSessions,
    focusSessionsLoading,
    addFocusSessionLocally,
    addManualFocusSession,
    editFocusSession,
    deleteFocusSession,
    appUser,
  } = useAppUser();

  const handleAddManualSession = async (start_time: Date, end_time: Date) => {
    try {
      const result = await addManualFocusSession(start_time, end_time);
      if (result.success) {
        console.log("Manual session added successfully");
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error adding manual session:", error);
    }
  };

  const handleEditSession = async (
    sessionId: string,
    start_time: Date,
    end_time: Date
  ) => {
    try {
      const result = await editFocusSession(sessionId, start_time, end_time);
      if (result.success) {
        console.log("Session updated successfully");
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const result = await deleteFocusSession(sessionId);
      if (result.success) {
        console.log("Session deleted successfully");
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    appUser && (
      <>
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Yokoso Watashi no Soul society...
          </p>
          <span
            className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 
    bg-[length:600%_100%] bg-clip-text text-transparent animate-smooth-rainbow"
          >
            {appUser ? appUser.username : "Guest"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 h-screen">
          <Card>
            <CardHeader>
              <CardTitle>Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                This card shows the total focus time for the user.
              </CardDescription>
              <span className="font-semibold"></span>
              <ChartAreaGradient
                userId={String(user?.id)}
                theme={String(theme)}
                mini={false}
                reset={0}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </>
    )
  );
};

export default page;
