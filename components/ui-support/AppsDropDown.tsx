import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

const AppsDropDown = ({
  navItems,
}: {
  navItems: { title: string; href: string }[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Apps"
        >
          <LayoutGrid className="size-5 text-muted-foreground glow" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navItems.map((item) => (
          <DropdownMenuItem asChild key={item.href}>
            <Link href={item.href}>{item.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppsDropDown;
