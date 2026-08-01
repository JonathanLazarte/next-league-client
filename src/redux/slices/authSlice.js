import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk para login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pokemons/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || "Login failed");
      }
      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk para login
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pokemons/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || "Register failed");
      }
      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    } /*finally {

    }*/
  },
);

// Async thunk para verificar token
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pokemons/auth/verify`,
        {
          method: "POST" /*'GET'*/,
          /*headers: {
          'Authorization': `Bearer ${token}`,
        },*/
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        /*localStorage.removeItem('token')*/
        return rejectWithValue(data.message || "Token verification failed");
      }

      return data;
    } catch (error) {
      /*localStorage.removeItem('token')*/
      console.log("error")
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        /*state.user = action.payload.user*/
      })
      .addCase(verifyToken.rejected, (state /*, action*/) => {
        state.loading = false;
        //state.isAuthenticated = false
        //state.user = null
        //state.token = null
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
