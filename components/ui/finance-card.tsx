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

const FinanceCard = () => {
  return (
    <Link href="/finance" className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Enter Finance Mode</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default FinanceCard;
