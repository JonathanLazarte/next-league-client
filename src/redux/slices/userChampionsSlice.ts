import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { confirmPurchase } from "./purchaseSlice";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Thunks
export const getUserChampions = createAsyncThunk(
  "userChampions/getUserChampions",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}api/v1/user/champion-collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to fetch Champions");

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

interface UserChampionsState {
  loading: boolean,
  champions: string[],
  error: null | string | unknown,
}

// Initial state
const initialState: UserChampionsState = {
  loading: false,
  champions: [],
  error: null,
};

// Slice
const userChampionsSlice = createSlice({
  name: "userChampions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserChampions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChampions.fulfilled, (state, action) => {
        state.loading = false;
        state.champions = action.payload;
      })
      .addCase(getUserChampions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // addChampion
      /*.addCase(addChampion.fulfilled, (state, action) => {
        state.loading = false;
        state.champions.push(action.payload);
      })*/
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { newInventoryItem, type } = action.payload;
        if (type === "champion") {
          const updatedChampions = [...state.champions];
          updatedChampions.push(newInventoryItem);
          state.champions = updatedChampions;
        }
      });
  },
});

// Selectors
export const selectUserChampionsState = (state) => state.userChampions;
export const selectUserChampions = (state) => state.userChampions.champions;
export const selectUserChampionsLoading = (state) =>
  state.userChampions.loading;
export const selectUserChampionsError = (state) => state.userChampions.error;

export const selectUserChampionsData = createSelector(
  [selectUserChampions, selectUserChampionsLoading, selectUserChampionsError],
  (champions, loading, error) => ({
    userChampions: champions,
    loading,
    error,
  }),
);

export default userChampionsSlice.reducer;
