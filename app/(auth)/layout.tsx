"use client";

import { useEffect } from "react";
/*import { useRouter } from "@/hooks/useRouter";*/
import { useRouter as useNextRouter} from "next/navigation";
import { preload } from "react-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout({ children }: { children: React.ReactNode}) {
  const nextRouter = useNextRouter();
  const { isAuthenticated } = useAuth();

  // Prefetch del dashboard mientras el usuario está en login/register
  // así el chunk ya está descargado cuando navega
  useEffect(() => {
    nextRouter.prefetch("/league");
    preload("LOADING/.webm", { as: "video", fetchPriority: "high" });
  }, []);


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
    return; // No renderizar nada mientras redirige
  }

  return (
    <div className="auth-layout min-h-screen flex items-center justify-center">
      <div className="auth-container">{children}</div>
    </div>
  );
}
