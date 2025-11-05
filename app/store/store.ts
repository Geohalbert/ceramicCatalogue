import { configureStore } from '@reduxjs/toolkit';
import potteryReducer from './potterySlice';

export const store = configureStore({
  reducer: {
    pottery: potteryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

