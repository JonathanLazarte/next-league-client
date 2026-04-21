import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { confirmPurchase } from './purchaseSlice.js'
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Thunks
export const getUserChampions = createAsyncThunk(
  'userChampions/getUserChampions',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}pokemons/users/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to fetch Pokémon');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*export const addChampion = createAsyncThunk(
  'userChampions/addChampion',
  async ({ championId, coin, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const body = {
        userID: token,
        championId,
        coin,
        price,
      };

      const response = await fetch(`${API_URL}pokemons/users/addpokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to add champion');

      const data = await response.json();

      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);*/

export const updatePokemon = createAsyncThunk(
  'userChampions/updatePokemon',
  async (props, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const pokeballsState = [props];

    try {
      const response = await fetch(`${API_URL}pokemons/users/updatelevel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token,
          pokeballsState,
          pokemonExp: 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to consume item');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sellPokemon = createAsyncThunk(
  'userChampions/sellPokemon',
  async ({ pokemonId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const body = {
        userId: token,
        pokemonIndex: pokemonId,
      };

      const response = await fetch(`${API_URL}pokemons/users/sellpokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to sell Pokémon');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  champions: [],
  pokemon: [],
  error: '',
};

// Slice
const userChampionsSlice = createSlice({
  name: 'userChampions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getUserPokemon
    builder
      .addCase(getUserChampions.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserChampions.fulfilled, (state, action) => {
        state.loading = false;
        state.champions = action.payload;
      })
      .addCase(getUserChampions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // addChampion
      /*.addCase(addChampion.fulfilled, (state, action) => {
        state.loading = false;
        state.champions.push(action.payload);
      })*/

      // updatePokemon
      .addCase(updatePokemon.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updatePokemon.fulfilled, (state) => {
        state.loading = false;
        // Aquí puedes mapear correctamente si tenés pokemon en el state
        // state.pokemon = ... tu lógica
      })
      .addCase(updatePokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // sellPokemon
      .addCase(sellPokemon.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(sellPokemon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pokemon.findIndex(
          (p) => p.index === action.payload.pokemonIndex
        );
        if (index !== -1) {
          state.pokemon.splice(index, 1);
        }
      })
      .addCase(sellPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const updatedChampions = [...state.champions];
        updatedChampions.push(action.payload.newInventoryItem);
        state.champions = updatedChampions;
      })
  },
});

// Selectors
export const selectUserChampionsState = (state) => state.userChampions;
export const selectUserChampions = (state) => state.userChampions.champions;
export const selectUserChampionsLoading = (state) => state.userChampions.loading;
export const selectUserChampionsError = (state) => state.userChampions.error;

export const selectUserChampionsData = createSelector(
  [selectUserChampions, selectUserChampionsLoading, selectUserChampionsError],
  (champions, loading, error) => ({
    userChampions: champions,
    loading,
    error,
  })
);

export default userChampionsSlice.reducer;