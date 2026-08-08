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
  const [localStorageToken, setLocalStorageToken] = useState() // undefined | null | string
  const [explicitLogout, setExplicitLogout] = useState()
  const dispatch = store.dispatch;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenFromLocalStorage = localStorage.getItem('token')
      tokenFromLocalStorage ? setLocalStorageToken(tokenFromLocalStorage) : setLocalStorageToken(null)

      const explicitLogoutLocalStorage = localStorage.getItem('explicit-logout')
      explicitLogoutLocalStorage ? setExplicitLogout(true) : setExplicitLogout(false)

    }
  }, [])

  useEffect(() => {

    if (loading || localStorageToken === undefined || explicitLogout === undefined) return;

    if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
      router.push("/league");
      return;
    }

    if (!isAuthenticated && (localStorageToken)) {
      dispatch(verifyToken(localStorageToken))
      return
    }

    if (!isAuthenticated && !localStorageToken && !explicitLogout) {
      localStorage.setItem("token", "8bd66836-d9d6-4c42-9e24-fda3d2e3a10d")
      setLocalStorageToken("8bd66836-d9d6-4c42-9e24-fda3d2e3a10d")
      return
    }

    if (!isAuthenticated && (pathname !== '/login' && pathname !== '/register')) {
      router.push('/login');
      return
    }
  }, [isAuthenticated, loading, router, localStorageToken, explicitLogout]);

  console.log(localStorageToken)

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
