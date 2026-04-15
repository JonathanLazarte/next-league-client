"use client";

import { useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useSelector } from "react-redux";
import { useRouter as useNextRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Prefetch del dashboard mientras el usuario está en login/register
  // así el chunk ya está descargado cuando navega
  useEffect(() => {
    nextRouter.prefetch("/league");
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/league");
    }
  }, [isAuthenticated, loading, router]);

  /*useEffect(() => {
      localStorage.setItem('token', null)
  }, [])*/
  /*if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gold text-lg">Loading...</p>
        </div>
      </div>
    )
  }*/

  if (isAuthenticated) {
    return (
      <div>
        <img className="lol-logo-image" src="/LOL_Icon_Rendered.png" />
      </div>
    ); // No renderizar nada mientras redirige
  }

  return (
    <div className="auth-layout min-h-screen flex items-center justify-center">
      <div className="auth-container">{children}</div>
    </div>
  );
}
