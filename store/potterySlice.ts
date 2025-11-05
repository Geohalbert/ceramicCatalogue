import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pottery, PotteryState } from './types';

const initialState: PotteryState = {
  items: [],
};

const potterySlice = createSlice({
  name: 'pottery',
  initialState,
  reducers: {
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
  },
});

export const { addPottery, updatePottery, deletePottery, setPottery } = potterySlice.actions;
export default potterySlice.reducer;

