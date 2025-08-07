"use client";

import React from "react";
import { useTheme } from "next-themes";

const FaviconFunctions = () => {
  const { theme } = useTheme();
  const iconClass = theme === "dark" ? "invert" : "";

  return (
    <link
      rel="icon"
      href={`/work-study-icon.svg`}
      className={iconClass}
      type="image/svg+xml"
    />
  );
};

export default FaviconFunctions;
