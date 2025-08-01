"use client";

import { LayoutGrid, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";

import SearchDropDown from "../ui-support/SearchDropDown";
import AppsDropDown from "../ui-support/AppsDropDown";

import { Button } from "./button";

export const navigationItems = [
  {
    title: "Focus Tracker",
    href: "/focus-tracker",
    items: [],
  },
  {
    title: "Finances",
    href: "/finances",
    items: [],
  },
];

export default function GlassmorphNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed left-1/2 top-0 z-50 mt-7 flex w-11/12 max-w-8xl -translate-x-1/2 flex-col items-center rounded-full bg-background/20 p-3 backdrop-blur-lg md:rounded-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/work-study-icon.svg"
              className="dark:invert w-10 pr-2"
              alt="work-study-sim logo"
              width={50}
              height={50}
            />
          </Link>

          <div className="hidden gap-4 md:flex">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <ModeToggle />
            <SearchDropDown />
            <AppsDropDown />
          </div>
        </div>

        <div className="md:hidden">
          <Button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-3 md:hidden">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
