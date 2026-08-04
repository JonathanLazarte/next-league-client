"use client";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import store from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";


export const AuthProvider = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const  [localStorageToken, setLocalStorageToken ] = useState() // undefined | null | string
  const dispatch = store.dispatch;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenFromLocalStorage = localStorage.getItem('token')
      setLocalStorageToken(tokenFromLocalStorage)
    }
  }, [isAuthenticated, loading])

  useEffect(() => {

    if (loading || localStorageToken === undefined) return;

    if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
      router.push("/league");
      return;
    }

    if (!isAuthenticated && (localStorageToken)) {
      dispatch(verifyToken(localStorageToken))
      return
    }

    if (!isAuthenticated && (pathname !== '/login' && pathname !== '/register')) {
      router.push('/login');
      return
    }

  }, [isAuthenticated, loading, router, localStorageToken]);

  return (children)
};

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <AuthProvider><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></AuthProvider>
    </ReduxProvider>
  );
}
