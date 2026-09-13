import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { confirmPurchase } from "@/redux/slices/purchaseSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserSkins = createAsyncThunk<
  Record<string, any>,
  string,
  {}
>(
  "userSkins/getUserSkins",
  async ( token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}api/v1/user/skin-collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userSkins = await response.json();

      return { userSkins };
    } catch ( error ) {
      return rejectWithValue(error);
    }
  },
);

interface UserSkinsState {
  loading: boolean,
  skins: string[],
  error: null | string | unknown,
}

const initialState: UserSkinsState = {
  loading: false,
  skins: [],
  error: null,
};

const userSkinsSlice = createSlice({
  name: "userSkins",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSkins.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUserSkins.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.skins = action.payload.userSkins;
      })
      .addCase(getUserSkins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { newInventoryItem, type } = action.payload;
        if (type === "skin") {
          const updatedSkins = [...state.skins];
          updatedSkins.push(newInventoryItem);
          state.skins = updatedSkins;
        }
      });
  },
});

interface StateProp {
  userSkins: UserSkinsState
}

export const selectUserSkinsState = (state: StateProp) => state.userSkins;
export const selectUserSkins = (state: StateProp) => state.userSkins.skins;
export const selectUserSkinsLoading = (state: StateProp) => state.userSkins.loading;
export const selectUserSkinsError = (state: StateProp) => state.userSkins.error;

export const selectUserSkinsData = createSelector(
  [selectUserSkins, selectUserSkinsLoading, selectUserSkinsError],
  (userSkins, loading, error) => ({
    userSkins,
    loading,
    error,
  }),
);

export default userSkinsSlice.reducer;
