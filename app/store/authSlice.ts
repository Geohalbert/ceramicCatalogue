import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { User } from 'firebase/auth';

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async Thunks
export const signUpThunk = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }) => {
    const user = await authService.signUpWithEmail(email, password, displayName);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
);

export const signInThunk = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await authService.signInWithEmail(email, password);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
);

export const signOutThunk = createAsyncThunk(
  'auth/signOut',
  async () => {
    await authService.signOutUser();
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => {
    await authService.resetPassword(email);
  }
);

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async ({ request, promptAsync }: { request: any; promptAsync: any }) => {
    const user = await authService.signInWithGoogle(request, promptAsync);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string | null; displayName: string | null } | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign up';
      });

    // Sign In
    builder
      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign in';
      });

    // Sign Out
    builder
      .addCase(signOutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign out';
      });

    // Reset Password
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send reset email';
      });

    // Sign In with Google
    builder
      .addCase(signInWithGoogleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign in with Google';
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

