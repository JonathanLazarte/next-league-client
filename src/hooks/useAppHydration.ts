import { useEffect } from 'react';
import { useUser } from "@/hooks/useUser";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { preload } from 'react-dom'

export const useAppHydration = ( token: string ) => {
  const { fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins()

  useEffect(() => {
    if (!token) return;
    preload('/collection/borders/borders_epic.png', { as: "image" })
    getUserChampions(token);
    getUserSkins(token);
    fetchUser(token);
  }, [token, fetchUser, getUserChampions, getUserSkins]);
};
