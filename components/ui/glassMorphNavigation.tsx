"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./button";

import SearchDropDown from "../ui-support/SearchDropDown";
import AppsDropDown from "../ui-support/AppsDropDown";

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
  {
    title: "Leaderboard",
    href: "/leaderboard ",
    items: [],
  },
  {
    title: "Auth Test",
    href: "/auth-test",
    items: [],
  },
  {
    title: "Login",
    href: "/auth/login",
    items: [],
  },
  {
    title: "Sign Up",
    href: "/auth/signup",
    items: [],
  },
];

export default function GlassmorphNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navClassName = `fixed left-1/2 top-0 z-50 mt-7 flex w-11/12 max-w-8xl -translate-x-1/2 flex-col items-center bg-background/20 p-3 backdrop-blur-lg ${
    isOpen ? "rounded-md" : "rounded-full"
  } md:rounded-full`;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      className={navClassName}
      style={{
        transition: "background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/work-study-icon.svg"
              className="w-10 pr-2 dark:invert dark:[filter:invert(1)_drop-shadow(0_0_6px_theme(colors.primary.DEFAULT))]"
              alt="work-study-sim logo"
              width={50}
              height={50}
            />
          </Link>

          <div className="hidden gap-4 md:flex">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className="glow">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="glow"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="hover:text-primary-foreground bg-transparent text-primary">
                <Link href="/auth/login" className="">
                  Sign In
                </Link>
              </Button>
            )}
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
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-3 md:hidden animate-in slide-in-from-top-2 duration-300">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="glow"
            >
              {item.title}
            </Link>
          ))}
          {user && (
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full glow"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
