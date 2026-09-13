import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartyMember {
  userId: string;
  userName: string;
  alias: string;
  profile_icon: number;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
  tag: string;
}

export type queueState = 'idle' | 'searching' | 'found' | 'champ_select'

export interface MatchmakingState {
  selectedQueue: string | null;
  queueState: queueState;
  partyMembers: PartyMember[] | null;
}

const initialState: MatchmakingState = {
  selectedQueue: null,
  queueState: 'idle',
  partyMembers: null,
};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    setSelectedQueue: (state, action: PayloadAction<string>) => {
      state.selectedQueue = action.payload;
    },
    setQueueState: (state, action: PayloadAction<queueState>) => {
      state.queueState = action.payload;
    },
    setPartyMembers: (state, action: PayloadAction<PartyMember>) => {
      if (!state.partyMembers) {
        state.partyMembers = [action.payload]
      } else {
        state.partyMembers.push(action.payload)
      }
    },
    findMatch: () => {

    },
    leaveParty: () => {

    }
  },
});

export const { setSelectedQueue, setQueueState, setPartyMembers, findMatch, leaveParty } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;
