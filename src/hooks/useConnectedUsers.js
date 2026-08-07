import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { setFriendsOnline, setPartyMembers } from "@/redux/slices/connectedUsersSlice.ts";

export function useConnectedUsers() {
  const dispatch = useDispatch();
  const connectedUsers = useSelector((state) => state.connectedUsers);
  const updateFriendsOnline = useCallback((payload) => dispatch(setFriendsOnline(payload)), [dispatch]);
  const updatePartyMembers = useCallback((payload) => dispatch(setPartyMembers(payload)), [dispatch]);

  return {
    ...connectedUsers,
    connectedUsers,
    setFriendsOnline: updateFriendsOnline,
    setPartyMembers: updatePartyMembers,
  };
}
