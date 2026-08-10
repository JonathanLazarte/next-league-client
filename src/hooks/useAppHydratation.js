import { useEffect } from 'react';
import { useUser } from "@/hooks/useUser";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";

export const useAppHydration = (token) => {
  const { fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins()

  useEffect(() => {
    if (!token) return;

    getUserChampions(token);
    getUserSkins(token);
    fetchUser(token);
  }, [token, fetchUser, getUserChampions, getUserSkins]);
};
