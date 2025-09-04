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
    <Link href="/career" className="flex-1">
      <Card className="bg-card/60 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle>Enter Career Mode</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CareerCard;
