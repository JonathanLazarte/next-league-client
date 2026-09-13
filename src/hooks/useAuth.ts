"use client";

import { useRouter } from "@/hooks/useRouter";
import { useAppDispatch, useAppSelector } from "./hooks";
import { logout, clearError } from "@/redux/slices/authSlice";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/login", {});
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    logout: handleLogout,
    clearError: clearAuthError,
  };
}
