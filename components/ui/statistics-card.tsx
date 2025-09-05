import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FocusHeatChart from "./focus-heatchart";
import FocusChart from "../ui-support/focus-chart";
import Link from "next/link";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640); // Tailwind "sm" breakpoint
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMobile;
};

const FinanceCard = () => {
  const isMobile = useIsMobile();

  return (
    <Link href="/finance" className="">
      <Card className="bg-card/60 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>View your statistics and insights.</CardDescription>
          <FocusHeatChart />
          <div className="mt-4" />
          <FocusChart mini={isMobile} span="lastWeek" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default FinanceCard;
