import React from "react";
import Link from "next/link";
import ExampleCard from "../ui/example-card";

const LandingNoUser = () => {
  return (
    <div>
      <div className="text-center w-full mb-16">
        <h1 className="font-[800] mb-10 pb-4 text-4xl inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 dark:from-primary dark:via-blue-400 dark:to-primary">
          Welcome to Work Study Sim
        </h1>
        <p className="text-lg mb-4">
          Track your progress and stay focused. <br />
          Get started by{" "}
          <Link
            href="/auth/signup"
            className="hover:underline text-blue-600 dark:text-blue-400"
          >
            creating an account
          </Link>{" "}
          or{" "}
          <Link
            href="/auth/login"
            className="hover:underline text-blue-600 dark:text-blue-400"
          >
            logging in
          </Link>
        </p>
        <h2 className="font-bold text-2xl mt-8 text-primary">Example Usage</h2>
      </div>

      <div className="flex items-center gap-4 w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ExampleCard
            card_title="Focus Tracker"
            description_1="Total Focus Time: 716.12 Hours"
            description_2="Track your focus and productivity levels throughout the day, week, month, and year."
            href="/example-focus-tracker"
          />

          <ExampleCard
            card_title="Finance Tracker"
            description_1="Total Income: £58,305.12"
            description_2={`Fiscally quantify your productivity levels by equating your focus time to your dream job roles salary.`}
            href="/example-finance-tracker"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingNoUser;
