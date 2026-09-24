import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useCallback } from "react";
import { fetchUser, updateCoins, updateUser } from "@/redux/slices/userSlice";
import type { User } from "@/types/user";

function useUser() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user, shallowEqual);

  const fetchUserData = useCallback((payload: string) => dispatch(fetchUser(payload)), [dispatch]);
  const updateUserData = useCallback((payload: User) => dispatch(updateUser(payload)), [dispatch]);
  const updateUserCoins = useCallback((payload: { coin: "RP" | "BE"; price: number }) => dispatch(updateCoins(payload)), [dispatch]);

  return {
    ...user,
    user,
    fetchUser: fetchUserData,
    updateUser: updateUserData,
    updateCoins: updateUserCoins,
  };
}

export { useUser };
