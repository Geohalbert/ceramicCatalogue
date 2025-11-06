import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pottery, PotteryState } from './types';
import * as firestoreService from '../services/firestoreService';

const initialState: PotteryState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks for Firestore operations
export const fetchPotteryItemsThunk = createAsyncThunk(
  'pottery/fetchAll',
  async () => {
    const items = await firestoreService.fetchPotteryItems();
    return items;
  }
);

export const addPotteryThunk = createAsyncThunk(
  'pottery/add',
  async (pottery: Omit<Pottery, 'id'>) => {
    const id = await firestoreService.addPotteryItem(pottery);
    return { ...pottery, id };
  }
);

export const updatePotteryThunk = createAsyncThunk(
  'pottery/update',
  async (pottery: Pottery) => {
    await firestoreService.updatePotteryItem(pottery);
    return pottery;
  }
);

export const deletePotteryThunk = createAsyncThunk(
  'pottery/delete',
  async (id: string) => {
    await firestoreService.deletePotteryItem(id);
    return id;
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
  },
});

export const { addPottery, updatePottery, deletePottery, setPottery, clearError } = potterySlice.actions;
export default potterySlice.reducer;

