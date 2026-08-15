import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, verifyToken } from "@/redux/slices/authSlice";
import { confirmPurchase } from '@/redux/slices/purchaseSlice'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUser = createAsyncThunk(
  "user/set-user",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}api/v1/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      })
      if (!response.ok) {
        throw new Error('No se pudo obtener el usuario')
      }

      const userData = await response.json()

      return { userData }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

interface Rank {
  name: string;
  level: number;
  points: number;
}

interface UserState {
  userName: string;
  id: string;
  alias: string;
  tag: string;
  title: string;
  level: number;
  EXP: number;
  BE: number;
  RP: number;
  rank: Rank;
  profile_icon: string;
  profile_background: string;
  loading: boolean;
}

const initialState: UserState = {
  userName: "",
  id: "",
  alias: "",
  tag: "",
  title: "",
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
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    updateUser: () => {
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
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        Object.assign(state, action.payload.userData)
        state.loading = false
      })
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
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { coin, price } = action.payload
        state[coin] = state[coin] - price;
      });
  },
});

export const { setUser, updateUser, updateCoins } =
  userSlice.actions;

export const selectRP = (state) => state.user.RP;
export const selectBE = (state) => state.user.BE;

export const selectUserData = createSelector(
  [selectRP, selectBE],
  (RP, BE) => ({
    RP,
    BE
  }))

export default userSlice.reducer;
