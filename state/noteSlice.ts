import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const noteSlice = createSlice({
  name: "noteSlice",
  initialState: { value: initialState },
  reducers: {
    editNote: (state, action) => {
      state.value = action.payload;
    },
  },
});

const { actions, reducer } = noteSlice;
export const { editNote } = actions;
export default reducer;
