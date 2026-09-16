import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConnectedUser {
  id: string;
  alias: string;
  tag: string;
  title: string;
  rank: object;
  profile_icon: number;
  profile_background: string;
  profile_border: string;
  status: "online" | "offline" | "away";
  activity:
    | "idle"
    | "in queue"
    | "ranked_flex"
    | "ranked_solo_duo"
    | "swiftplay"
    | "in_game";
}


interface ConnectedUsersState {
  friendsOnline: Record<string, ConnectedUser[]>[];
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
    setFriendsOnline: (state, action: PayloadAction<Record<string, ConnectedUser[] >[]>) => {
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
