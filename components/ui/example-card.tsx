import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ExampleCard = ({
  card_title,
  description_1,
  description_2,
  href,
}: {
  card_title: string;
  description_1: string;
  description_2: string;
  href: string;
}) => {
  return (
    <Link className="grid text-center" href={href}>
      <Card className="grid grid-rows-[auto,1fr] h-full min-w-[300px] bg-primary-foreground dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-800">
        <CardHeader>
          <CardTitle>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-blue-400">
              {card_title}
            </span>
          </CardTitle>
        </CardHeader>
        <div className="flex justify-center">
          <Image
            src="/example_chart.jpg"
            alt="Example Chart"
            width={500}
            height={300}
            className="w-[50%] h-48 object-cover rounded-t-lg mb-4"
          />
        </div>
        <CardContent>
          <span className="block text-xl sm:text-2xl md:text-xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-blue-300">
            {description_1}
          </span>
          <CardDescription className="text-center text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">
            {description_2}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ExampleCard;
