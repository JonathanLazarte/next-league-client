"use client";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import store from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken } from "@/redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";


export const AuthProvider = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const explicitLogout = localStorage.getItem('explicit-logout') === 'true';

      if (isAuthenticated) {
        setIsInitialized(true);
        return;
      }

      if (token) {
        await dispatch(verifyToken(token));
      } else if (!explicitLogout) {
        // Invitado
        await dispatch(verifyToken("8bd66836-d9d6-4c42-9e24-fda3d2e3a10d"));
      }

      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isInitialized || loading) return;

    const isPublicPage = pathname === '/login' || pathname === '/register';

    if (isAuthenticated) {
      if (isPublicPage || pathname === '/') {
        router.push("/league");
      }
    } else {
      if (!isPublicPage) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, isInitialized, pathname, router]);


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
