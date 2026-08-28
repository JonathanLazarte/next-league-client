import { useSelector } from "react-redux";
import { useCallback } from "react";
import { getUserSkins, selectUserSkinsData } from "@/redux/slices/userSkinsSlice";
import { useAppDispatch } from '@/hooks/hooks'

export function useUserSkins() {
  const dispatch = useAppDispatch();
  const userSkinsState = useSelector(selectUserSkinsData);
  const fetchUserSkins = useCallback((payload) => dispatch(getUserSkins(payload)), [dispatch]);

  return {
    ...userSkinsState,
    getUserSkins: fetchUserSkins,
  };
}
