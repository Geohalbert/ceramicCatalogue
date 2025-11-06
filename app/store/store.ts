import { configureStore } from '@reduxjs/toolkit';
import potteryReducer from './potterySlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    pottery: potteryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

