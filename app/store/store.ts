import { configureStore } from '@reduxjs/toolkit';
import jackpotReducer from '../features/jackpot/jackpotSlice';

export const store = configureStore({
  reducer: {
    jackpot: jackpotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
