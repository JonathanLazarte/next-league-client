import { useSelector } from "react-redux";
import { useCallback } from "react";
import { getUserChampions, selectUserChampionsData } from "@/redux/slices/userChampionsSlice";
import { useAppDispatch } from '@/hooks/hooks'

export function useUserChampions() {
  const dispatch = useAppDispatch();
  const userChampionsState = useSelector(selectUserChampionsData);
  const fetchUserChampions = useCallback((payload: string) => dispatch(getUserChampions(payload)), [dispatch]);

  return {
    ...userChampionsState,
    getUserChampions: fetchUserChampions,
  };
}
