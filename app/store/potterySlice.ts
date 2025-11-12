import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pottery, PotteryState } from './types';
import * as firestoreService from '../services/firestoreService';
import * as localStorageService from '../services/localStorageService';
import { RootState } from './store';

const initialState: PotteryState = {
  items: [],
  loading: false,
  error: null,
};

// Hybrid Async Thunks - automatically choose local or cloud storage
export const fetchPotteryItemsThunk = createAsyncThunk(
  'pottery/fetchAll',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth?.isAuthenticated;
    const userId = state.auth?.user?.uid;

    if (isAuthenticated && userId) {
      // Fetch from Firebase
      const items = await firestoreService.fetchPotteryItems(userId);
      return items;
    } else {
      // Fetch from local storage
      const items = await localStorageService.fetchLocalPotteryItems();
      return items;
    }
  }
);

export const addPotteryThunk = createAsyncThunk(
  'pottery/add',
  async (pottery: Omit<Pottery, 'id'>, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth?.isAuthenticated;
    const userId = state.auth?.user?.uid;

    if (isAuthenticated && userId) {
      // Add to Firebase
      const id = await firestoreService.addPotteryItem(userId, pottery);
      return { ...pottery, id };
    } else {
      // Add to local storage
      const newPottery = await localStorageService.addLocalPotteryItem(pottery);
      return newPottery;
    }
  }
);

export const updatePotteryThunk = createAsyncThunk(
  'pottery/update',
  async (pottery: Pottery, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth?.isAuthenticated;
    const userId = state.auth?.user?.uid;

    if (isAuthenticated && userId) {
      // Update in Firebase
      await firestoreService.updatePotteryItem(userId, pottery);
      return pottery;
    } else {
      // Update in local storage
      const updatedPottery = await localStorageService.updateLocalPotteryItem(pottery);
      return updatedPottery;
    }
  }
);

export const deletePotteryThunk = createAsyncThunk(
  'pottery/delete',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth?.isAuthenticated;
    const userId = state.auth?.user?.uid;

    if (isAuthenticated && userId) {
      // Delete from Firebase
      await firestoreService.deletePotteryItem(userId, id);
      return id;
    } else {
      // Delete from local storage
      await localStorageService.deleteLocalPotteryItem(id);
      return id;
    }
  }
);

// Migration thunk - move local data to Firebase when user signs in
export const migrateLocalToFirebaseThunk = createAsyncThunk(
  'pottery/migrateToFirebase',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.uid;
    
    if (!userId) {
      throw new Error('User must be authenticated to migrate data');
    }
    
    const localItems = await localStorageService.fetchLocalPotteryItems();
    
    if (localItems.length === 0) {
      return [];
    }

    // Upload each item to Firebase
    const migratedItems: Pottery[] = [];
    for (const item of localItems) {
      const { id, ...itemData } = item; // Remove local ID
      const newId = await firestoreService.addPotteryItem(userId, itemData);
      migratedItems.push({ ...itemData, id: newId });
    }

    // Clear local storage after successful migration
    await localStorageService.clearLocalPotteryItems();

    return migratedItems;
  }
);

const potterySlice = createSlice({
  name: 'pottery',
  initialState,
  reducers: {
    // Local actions (for optimistic updates or offline use)
    addPottery: (state, action: PayloadAction<Pottery>) => {
      state.items.push(action.payload);
    },
    updatePottery: (state, action: PayloadAction<Pottery>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deletePottery: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setPottery: (state, action: PayloadAction<Pottery[]>) => {
      state.items = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all pottery items
    builder
      .addCase(fetchPotteryItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPotteryItemsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPotteryItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pottery items';
      });

    // Add pottery item
    builder
      .addCase(addPotteryThunk.pending, (state) => {
        // Don't set loading to true - this is handled by the AddItem screen locally
        state.error = null;
      })
      .addCase(addPotteryThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addPotteryThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add pottery item';
      });

    // Update pottery item
    builder
      .addCase(updatePotteryThunk.pending, (state) => {
        // Don't set loading to true - this is handled by the AddItem screen locally
        state.error = null;
      })
      .addCase(updatePotteryThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePotteryThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update pottery item';
      });

    // Delete pottery item
    builder
      .addCase(deletePotteryThunk.pending, (state) => {
        // Don't set loading to true - this is handled locally where deletion is triggered
        state.error = null;
      })
      .addCase(deletePotteryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deletePotteryThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete pottery item';
      });

    // Migrate local data to Firebase
    builder
      .addCase(migrateLocalToFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(migrateLocalToFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Merge migrated items with any existing Firebase items
        const existingIds = new Set(state.items.map(item => item.id));
        const newItems = action.payload.filter(item => !existingIds.has(item.id));
        state.items = [...state.items, ...newItems];
      })
      .addCase(migrateLocalToFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to migrate data';
      });
  },
});

export const { addPottery, updatePottery, deletePottery, setPottery, clearError } = potterySlice.actions;
export default potterySlice.reducer;

