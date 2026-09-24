import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ConnectedUser } from "@/types/user"

export interface FriendFolder {
  name: string,
  users: ConnectedUser[]
}
export type FriendFolders = FriendFolder[]

interface ConnectedUsersState {
  friendsOnline: FriendFolders;
  partyMembers: ConnectedUser[];
}

const initialState: ConnectedUsersState = {
  friendsOnline: [],
  partyMembers: [],
};

const connectedUsersSlice = createSlice({
  name: "connectedUsers",
  initialState,
  reducers: {
    setFriendsOnline: (state, action: PayloadAction<FriendFolders>) => {
      state.friendsOnline = action.payload;
    },
    setPartyMembers: (state, action: PayloadAction<ConnectedUser[]>) => {
      state.partyMembers = action.payload;
    },
  },
});

export const { setFriendsOnline, setPartyMembers } =
  connectedUsersSlice.actions;
export default connectedUsersSlice.reducer;
