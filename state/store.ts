import { configureStore } from "@reduxjs/toolkit";
import { moodSlice } from "./moodSlice";
import { noteSlice } from "./noteSlice";

export const store = configureStore({
  reducer: {
    moods: moodSlice.reducer,
    notes: noteSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
