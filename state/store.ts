import { configureStore } from "@reduxjs/toolkit";
import { moodSlice } from "./moodSlice";
import { noteSlice } from "./noteSlice";
import { settingSlice } from "./settingSlice";

export const store = configureStore({
  reducer: {
    moods: moodSlice.reducer,
    notes: noteSlice.reducer,
    settings: settingSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
