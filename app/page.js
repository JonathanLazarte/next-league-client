"use client";

import { useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
/*import { useSelector, useDispatch } from 'react-redux'
import { logout, verifyToken, clearError } from '@/redux/slices/authSlice'*/

/*import Image from 'next/image'*/

export default function HomePage() {
  const router = useRouter();
  /*const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  const localStoreToken = localStorage.getItem('item')*/

  /*useEffect(() => {
    if (!loading) {
        if (isAuthenticated) {
          console.log("nothing to do")
        } else if (localStoreToken) {
          // autentificar
          console.log("punto de verificacion correcto")
          dispatch(verifyToken)
        } else {
          router.push('/login')
        }
    }
  }, [isAuthenticated, loading, router, dispatch])*/

  useEffect(() => {
    router.push("/league");
  }, []);
}
