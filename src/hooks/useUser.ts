import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useCallback } from "react";
import { fetchUser, updateCoins, updateUser } from "@/redux/slices/userSlice";

function useUser() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user, shallowEqual);

  const fetchUserData = useCallback((payload) => dispatch(fetchUser(payload)), [dispatch]);
  const updateUserData = useCallback((payload) => dispatch(updateUser(payload)), [dispatch]);
  const updateUserCoins = useCallback((payload) => dispatch(updateCoins(payload)), [dispatch]);

  return {
    ...user,
    user,
    fetchUser: fetchUserData,
    updateUser: updateUserData,
    updateCoins: updateUserCoins,
  };
}

export { useUser };
