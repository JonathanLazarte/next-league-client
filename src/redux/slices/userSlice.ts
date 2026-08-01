import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser, verifyToken } from "@/redux/slices/authSlice.js";
import { confirmPurchase } from '@/redux/slices/purchaseSlice'

interface Rank {
  name: string;
  level: number;
  points: number;
}

interface UserState {
  userName: string;
  password: string;
  id: string;
  alias: string;
  tag: string;
  title: string;
  champions: string[];
  skins: string[];
  messages: string[];
  level: number;
  EXP: number;
  BE: number;
  RP: number;
  rank: Rank;
  profile_icon: string;
  profile_background: string;
}

const initialState: UserState = {
  userName: "",
  password: "",
  id: "",
  alias: "",
  tag: "",
  title: "",
  champions: [],
  skins: [],
  messages: [],
  level: 1,
  EXP: 0,
  BE: 20000,
  RP: 3000,
  rank: {
    name: "Bronze",
    level: 4,
    points: 100,
  },
  profile_icon: "",
  profile_background: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    updateUser: (/*state, action*/) => {
      // Aquí puedes añadir reducers para actualizar otros campos del usuario
      // Por ejemplo:
      // state.level = action.payload.level;
      // state.EXP = action.payload.EXP;
    },
    setUserMessages: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    updateCoins: (
      state,
      action: PayloadAction<{ coin: "RP" | "BE"; price: number }>,
    ) => {
      state.RP =
        action.payload.coin == "RP"
          ? state.RP - action.payload.price
          : state.RP;
      state.BE =
        action.payload.coin == "BE"
          ? state.BE - action.payload.price
          : state.BE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userName = action.payload.userName;
        state.id = action.payload.id;
        state.alias = action.payload.userName;
        state.tag = action.payload.tag;
        state.title = action.payload.title;
        state.level = action.payload.level;
        state.EXP = action.payload.EXP;
        state.BE = action.payload.BE;
        state.RP = action.payload.RP;
        state.profile_icon = action.payload.profile_icon;
        state.profile_background = action.payload.profile_background;
        state.rank = action.payload.rank;
        state.messages = action.payload.messages;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userName = action.payload.userName;
        state.id = action.payload.id;
        state.alias = action.payload.userName;
        state.tag = action.payload.tag;
        state.title = action.payload.title;
        state.level = action.payload.level;
        state.EXP = action.payload.EXP;
        state.BE = action.payload.BE;
        state.RP = action.payload.RP;
        state.profile_icon = action.payload.profile_icon;
        state.profile_background = action.payload.profile_background;
        state.rank = action.payload.rank;
        state.messages = action.payload.messages;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.userName = action.payload.userName;
        state.id = action.payload.id;
        state.alias = action.payload.userName;
        state.tag = action.payload.tag;
        state.title = action.payload.title;
        state.level = action.payload.level;
        state.EXP = action.payload.EXP;
        state.BE = action.payload.BE;
        state.RP = action.payload.RP;
        state.profile_icon = action.payload.profile_icon;
        state.profile_background = action.payload.profile_background;
        state.rank = action.payload.rank;
        state.messages = action.payload.messages;
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { coin, price } = action.payload
        state[coin] = state[coin] - price;
      });
  },
});

export const { setUser, updateUser, setUserMessages, updateCoins } =
  userSlice.actions;
export default userSlice.reducer;
