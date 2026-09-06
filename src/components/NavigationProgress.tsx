"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserInterface } from "@/hooks/useUserInterface";

export function NavigationProgress() {
  const pathname = usePathname();
  const { setNavigating } = useUserInterface();

  useEffect(() => {
    document.documentElement.classList.remove("navigating");
    setNavigating(false);
  }, [pathname, setNavigating]);

  return null;
}
