import { configureStore } from '@reduxjs/toolkit';
import superOddReducer from '../features/superOdd/superOddSlice';

export const store = configureStore({
  reducer: {
    superOdd: superOddReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
