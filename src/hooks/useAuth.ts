"use client";

import { useRouter } from "@/hooks/useRouter";
import { useAppDispatch, useAppSelector } from "./hooks";
import { logout, clearError, loginUser, registerUser } from "@/redux/slices/authSlice";
import { useCallback } from "react";
import { UserCredentials } from "@/types/user";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogin = useCallback(((payload: UserCredentials) => dispatch(loginUser(payload))), [dispatch])
  const handleRegister = useCallback(((payload: UserCredentials) => dispatch(registerUser(payload))), [dispatch])
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
    token,
    loading,
    error,
    logout: handleLogout,
    clearError: clearAuthError,
    login: handleLogin,
    register: handleRegister
  };
}
