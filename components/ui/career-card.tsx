import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const CareerCard = () => {
  return (
    <Link href="/career" className="">
      <Card className="bg-card/60 backdrop-blur-3xl h-full hover:scale-105 transition-all duration-200 hover:bg-primary-foreground/80 dark:hover:bg-black/20">
        <CardHeader>
          <CardTitle>Career</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>
            Explore various career paths and find the right fit for you.
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CareerCard;
