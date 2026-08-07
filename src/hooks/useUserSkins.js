import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { getUserSkins, selectUserSkinsData } from "@/redux/slices/userSkinsSlice";

export function useUserSkins() {
  const dispatch = useDispatch();
  const userSkinsState = useSelector(selectUserSkinsData);
  const fetchUserSkins = useCallback((payload) => dispatch(getUserSkins(payload)), [dispatch]);

  return {
    ...userSkinsState,
    getUserSkins: fetchUserSkins,
  };
}
