import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { getUserChampions, selectUserChampionsData, sellPokemon } from "@/redux/slices/userChampionsSlice";

export function useUserChampions() {
  const dispatch = useDispatch();
  const userChampionsState = useSelector(selectUserChampionsData);
  const fetchUserChampions = useCallback((payload) => dispatch(getUserChampions(payload)), [dispatch]);
  const sellUserPokemon = useCallback((payload) => dispatch(sellPokemon(payload)), [dispatch]);

  return {
    ...userChampionsState,
    getUserChampions: fetchUserChampions,
    sellPokemon: sellUserPokemon,
  };
}
