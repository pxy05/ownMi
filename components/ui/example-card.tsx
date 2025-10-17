import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

const ExampleCard = ({
  card_title,
  description_1,
  description_2,
  image
}: {
  card_title: string;
  description_1: string;
  description_2: string;
  image: string;
}) => {
  const isMobile = useIsMobile();

  // Append "-small" before the file extension for mobile
  const getImageSrc = (src: string) => {
    if (!isMobile) return src;
    
    const lastDotIndex = src.lastIndexOf('.');
    if (lastDotIndex === -1) return src + '-small';
    
    return src.substring(0, lastDotIndex) + '-small' + src.substring(lastDotIndex);
  };

  const imageSrc = getImageSrc(image);

  return (
    <div className="grid text-center">
      <Card className="grid grid-rows-[auto,1fr] h-full min-w-[300px] bg-primary-foreground dark:bg-black-800/80 border border-gray-200 dark:border-white/20 transition-all duration-200 hover:scale-105 hover:bg-primary-foreground/80 dark:hover:bg-black/20">
        <CardHeader>
          <CardTitle>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-primary">
              {card_title}
            </span>
          </CardTitle>
        </CardHeader>
        <div className="flex justify-center">
          <Image
            src={imageSrc}
            alt="Example Chart"
            width={700}
            height={400}
            className="w-[70%] h-48 object-cover rounded-t-lg mb-4"
          />
        </div>
        <CardContent>
          <span className="block text-xl sm:text-2xl md:text-xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-primary">
            {description_1}
          </span>
          <CardDescription className="text-center text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">
            {description_2}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExampleCard;
