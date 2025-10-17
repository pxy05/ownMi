import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const FocusCard = () => {
  return (
    <Link href="/focus-tracker" className="">
      <Card className="bg-card/60 backdrop-blur-3xl h-full hover:scale-105 transition-all duration-200 hover:bg-primary-foreground/80 dark:hover:bg-black/20">
        <CardHeader>
          <CardTitle>Enter Focus Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Enter focus mode to track your focus sessions.
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FocusCard;
