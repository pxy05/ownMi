import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChartAreaGradient } from "../ui-support/line-graph-chart";

interface SidebarProps {
  items: string[];
  side?: "left" | "right";
}

const Sidebar: React.FC<SidebarProps> = ({ items, side = "left" }) => {
  const [open, setOpen] = useState(false);
  const [sidebarSide, setSidebarSide] = useState<"left" | "right">(side);

  const toggleOpen = () => setOpen((prev) => !prev);
  const toggleSide = () =>
    setSidebarSide((prev) => (prev === "left" ? "right" : "left"));

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed ${
          sidebarSide === "left" ? "left-4" : "right-4"
        } top-20 bottom-6 z-40 transition-transform duration-300
        ${
          open
            ? "translate-x-0"
            : sidebarSide === "left"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        <Card
          className="relative h-[85vh] w-96 rounded-2xl shadow-2xl flex flex-col 
          backdrop-blur-md bg-background/60 border border-border/40"
        >
          {/* Sidebar content */}
          <div className="pl-4 pr-4 flex flex-col gap-4 h-full overflow-y-auto">
            <div className="hover:shadow-lg duration-200 rounded-lg bg-none">
              <ChartAreaGradient />
            </div>
            {items.map((item, idx) => (
              <Card
                key={idx}
                className="p-3 hover:shadow-lg transition-shadow duration-200 
                backdrop-blur-sm bg-muted/70 border border-border/40"
              >
                {item}
              </Card>
            ))}
          </div>
          {/* Toggle side button */}
          <Button
            variant="outline"
            onClick={toggleSide}
            className={`absolute bottom-4 z-100 ${
              sidebarSide === "left" ? "right-4" : "left-4"
            }`}
          >
            {sidebarSide === "left" ? "Move Right->" : "<-Move Left"}
          </Button>
        </Card>
      </div>

      {/* Chevron “hump” button */}
      <Button
        onClick={toggleOpen}
        className={`fixed top-1/2 -translate-y-1/2 z-50 rounded-full w-10 h-10 flex items-center justify-center shadow-lg bg-background/80 border border-border transition-all duration-300
          ${sidebarSide === "left" ? "left-6" : "right-6"}
          ${
            open
              ? sidebarSide === "left"
                ? "translate-x-96"
                : "-translate-x-96"
              : sidebarSide === "left"
              ? "-translate-x-6"
              : "translate-x-6"
          }
         border-[50%]`}
      >
        {sidebarSide === "left" ? (
          open ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )
        ) : open ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </Button>
    </>
  );
};

export default Sidebar;
