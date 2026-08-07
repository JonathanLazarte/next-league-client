"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useCallback } from "react";
import { useUserInterface } from "@/hooks/useUserInterface";

export function useRouter() {
  const router = useNextRouter();
  const { setNavigating } = useUserInterface();

  const push = useCallback(
    (href, options) => {
      if (
        typeof document !== "undefined" &&
        (href === "/login" || href === "/register")
      ) {
        document.documentElement.classList.add("navigating");
      }
      setNavigating(true);
      router.push(href, options);
    },
    [router, setNavigating],
  );

  const replace = useCallback(
    (href, options) => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.add("navigating");
      }
      setNavigating(true);
      router.replace(href, options);
    },
    [router, setNavigating],
  );

  return { ...router, push, replace };
}
