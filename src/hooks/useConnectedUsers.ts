import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useCallback } from "react";
import { setFriendsOnline, setPartyMembers } from "@/redux/slices/connectedUsersSlice";

export function useConnectedUsers() {
  const dispatch = useAppDispatch();
  const connectedUsers = useAppSelector((state) => state.connectedUsers);
  const updateFriendsOnline = useCallback((payload) => dispatch(setFriendsOnline(payload)), [dispatch]);
  const updatePartyMembers = useCallback((payload) => dispatch(setPartyMembers(payload)), [dispatch]);

  return {
    ...connectedUsers,
    connectedUsers,
    setFriendsOnline: updateFriendsOnline,
    setPartyMembers: updatePartyMembers,
  };
}
