import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { navigationItems } from "../ui/glassMorphNavigation";

const AppsDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Apps"
        >
          <LayoutGrid className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigationItems.map((item) => (
          <DropdownMenuItem asChild key={item.href}>
            <Link href={item.href}>{item.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppsDropDown;
