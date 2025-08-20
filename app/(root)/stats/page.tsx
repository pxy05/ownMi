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
import { createClient } from "@/lib/supabase/client";

const page = () => {
  const { appUser } = useAppUser();
  const supabase = createClient();

  const [userFocusSessions, setUserFocusSessions] = React.useState<any[]>([]);
  const [totalFocusTime, setTotalFocusTime] = React.useState<number>(0);

  React.useEffect(() => {
    async function fetchFocusSessions() {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", appUser?.id);

      if (data) {
        setUserFocusSessions(data);
        setTotalFocusTime(getTotalFocusTime(data));
      }
    }

    if (appUser?.id) {
      fetchFocusSessions();
    }
  }, [appUser?.id, supabase]);

  function getTotalFocusTime(userFocusSessions: any[]) {
    let totalFocus = 0;
    for (const sesh of userFocusSessions) {
      totalFocus += sesh.duration_seconds;
    }
    return totalFocus;
  }

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
                <span className="font-semibold">
                  {Math.floor(totalFocusTime / 3600)} minutes
                </span>
              </CardDescription>
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
