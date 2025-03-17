"use client";

import { useEffect, useState } from "react";

export default function ThemeClient() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.style.colorScheme = savedTheme;
  }, []);

  return null; // No UI, just logic
}
