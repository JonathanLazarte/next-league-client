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
interface UserPayload {
  userName: string;
  id: string;
  tag: string;
  title: string;
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

const updateUserFields = (state: UserState, action: PayloadAction<UserPayload>) => {
  const { payload } = action;
  state.userName = payload.userName;
    state.id = payload.id;
    state.alias = payload.userName;
    state.tag = payload.tag;
    state.title = payload.title;
    state.level = payload.level;
    state.EXP = payload.EXP;
    state.BE = payload.BE;
    state.RP = payload.RP;
    state.profile_icon = payload.profile_icon;
    state.profile_background = payload.profile_background;
    state.rank = payload.rank;
}

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
        updateUserFields(state, action)
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        updateUserFields(state, action)
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        updateUserFields(state, action)
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
