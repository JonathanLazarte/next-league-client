import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useCallback } from "react";
import { setFriendsOnline, setPartyMembers } from "@/redux/slices/connectedUsersSlice";
import type { ConnectedUser } from '@/redux/slices/connectedUsersSlice'

export function useConnectedUsers() {
  const dispatch = useAppDispatch();
  const connectedUsers = useAppSelector((state) => state.connectedUsers);
  const updateFriendsOnline = useCallback((payload: ConnectedUser[]) => dispatch(setFriendsOnline(payload)), [dispatch]);
  const updatePartyMembers = useCallback((payload: ConnectedUser[]) => dispatch(setPartyMembers(payload)), [dispatch]);

  return {
    ...connectedUsers,
    connectedUsers,
    setFriendsOnline: updateFriendsOnline,
    setPartyMembers: updatePartyMembers,
  };
}
