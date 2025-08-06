import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <main>
        <div className="text-center w-full">
        <h1 className="mb-10 pb-4 text-4xl font-bold inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 dark:from-primary dark:via-blue-400 dark:to-primary">
          Welcome to Work Study Sim
          
        </h1>
        </div>
        <div className="flex items-center gap-4 w-full h-full">
          <Link
            className="flex-1 h-full bg-blur-sm hover:bg-blur-md transition-all duration-300"
            href="/focus-tracker"
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle>
                  <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                    Focus Tracker
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                  Total Hours: 716.12
                </span>
                <CardDescription className="text-center text-sm sm:text-base md:text-lg">
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
                  <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                    Finance Tracker
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                  Total Revenue: $10,133.12
                </span>
                <CardDescription className="text-center text-sm sm:text-base md:text-lg">
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
