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
import Img from "next/image";

const page = () => {
  const { appUser } = useAppUser();

  return (
    appUser && (
      <>
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Yokoso Watashi no Soul society...
          </p>
          <span
            className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 via-cyan-400 via-purple-500 to-pink-500 
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
