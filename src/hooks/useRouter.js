"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useCallback } from "react";
import { setIsNavigating } from "@/redux/slices/userInterfaceSlice";
import { useDispatch } from "react-redux";

export function useRouter() {
  const router = useNextRouter();
  const dispatch = useDispatch();

  const push = useCallback(
    (href, options) => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.add("navigating");
      }
      dispatch(setIsNavigating(true));
      router.push(href, options);
    },
    [router, dispatch],
  );

  const replace = useCallback(
    (href, options) => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.add("navigating");
      }
      dispatch(setIsNavigating(true));
      router.replace(href, options);
    },
    [router, dispatch],
  );

  return { ...router, push, replace };
}
