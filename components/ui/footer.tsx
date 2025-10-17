"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 md:flex-row md:justify-between md:items-start">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ownMi
          </Link>
          <p className="text-muted-foreground text-center md:text-left max-w-xs">
            Simulate your work-study journey. Plan, learn, and grow with our
            tools.
          </p>

          <div className="flex mt-2">
            <Button
              className="hover:text-primary pl-2 pr-2 w-full"
              size="icon"
              onClick={() =>
                window.open("https://github.com/pxy05/ownMi", "_blank")
              }
            >
              <Image
                src="/github-mark-white.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="h-4 w-4 flex-1 relative dark:invert"
              />
              <p className="flex-1">GitHub</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links and Copyright */}
      <div className="container mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <nav className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/privacy-policy"
            className="hover:underline text-muted-foreground"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground"></span>
          <Link
            href="/terms-of-service"
            className="hover:underline text-muted-foreground"
          >
            Terms of Service
          </Link>
          <span className="text-muted-foreground"></span>
          <Link
            href="/cookies-settings"
            className="hover:underline text-muted-foreground"
          >
            Cookies Settings
          </Link>
          <span className="text-muted-foreground"></span>
          <Link
            href="/contact"
            className="hover:underline text-muted-foreground"
          >
            Contact
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground text-center md:text-right">
          &copy; 2025 ownMi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
