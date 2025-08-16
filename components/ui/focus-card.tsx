import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const FocusCard = () => {
  return (
    <Link href="/focus-tracker" className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Enter Focus Mode</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default FocusCard;
