"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsNavigating } from "@/redux/slices/userInterfaceSlice.ts";

export function NavigationProgress() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.remove("navigating");
    dispatch(setIsNavigating(false));
  }, [pathname]);

  return null;
}
