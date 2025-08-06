import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full h-full">
        <h1 className="ml-150  mb-10 pb-4 text-4xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 inline-block text-transparent bg-clip-text ">
          Welcome to Work Study Sim
        </h1>
        <div className="flex items-center gap-4 w-full h-full">
          <Link
            className="flex-1 h-full bg-blur-sm hover:bg-blur-md transition-all duration-300"
            href="/focus-tracker"
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle>
                  <span className="glow pl-2">Focus Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track your focus and productivity levels throughout the day.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link
            className="flex-1 h-full bg-blur-sm hover:bg-blur-md transition-all duration-300"
            href="/finance"
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle>
                  <span className="glow pl-2">Finance Tracker</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>
                  <span className="pl-2 text-4xl font-bold">
                    Total Revenue: {user.totalRevenue}
                  </span>
                </CardDescription>
                <CardDescription className="text-center">
                  Track your finances and manage your budget effectively.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
