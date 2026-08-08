"use client";

import { useRouter } from "@/hooks/useRouter";
import { useSelector, useDispatch } from "react-redux";
import { logout, clearError } from "@/redux/slices/authSlice";

export function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, token, loading, error } = useSelector(
    (state) => state.auth,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/login");
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
