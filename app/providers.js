"use client";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import store from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
//import { verifyToken } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";


export const AuthProvider = ({ children }) => {
  const localStoreToken = localStorage.getItem("token");
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  //const dispatch = store.dispatch;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(localStoreToken)
    if (loading) return;

    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push("/league");
    }

    /*if (!isAuthenticated && (localStoreToken !== 'undefined' && localStorage)) {
      dispatch(verifyToken(localStoreToken))
    }*/

    if (!isAuthenticated && (pathname !== '/login' && pathname !== '/register')) {
      router.push('/login');
    }

  }, [isAuthenticated, loading, router]);

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
