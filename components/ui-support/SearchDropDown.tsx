import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search"
        >
          <Search className="size-5 text-muted-foreground glow" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Search (Coming soon)</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchDropDown;
