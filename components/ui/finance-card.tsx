import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const FinanceCard = () => {
  return (
    <Link href="/finance" className="flex-1">
      <Card className="bg-card/60 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle>Enter Finance Mode</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default FinanceCard;
