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

const FocusCard = () => {
  return (
    <Link href="/focus" className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Enter Focus Mode</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default FocusCard;
