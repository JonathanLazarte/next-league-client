import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchmakingState {
  selectedQueue: string | null;
  queueState: 'idle' | 'searching' | 'found' | 'champ_select';
  partyMembers: object[] | null;
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
    setQueueState: (state, action: PayloadAction<MatchmakingState['queueState']>) => {
      state.queueState = action.payload;
    },
    setPartyMembers: (state, action: PayloadAction<Record<string, any>>) => {
      state.partyMembers.push(action.payload)
    },
    findMatch: () => {

    },
    leaveParty: () => {

    }
  },
});

export const { setSelectedQueue, setQueueState } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;
