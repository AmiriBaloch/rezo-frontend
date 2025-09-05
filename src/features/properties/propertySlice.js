import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPropertyId: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setSelectedPropertyId: (state, action) => {
      state.selectedPropertyId = action.payload;
    },
    clearSelectedPropertyId: (state) => {
      state.selectedPropertyId = null;
    },
  },
});

export const { setSelectedPropertyId, clearSelectedPropertyId } =
  propertySlice.actions;
export default propertySlice.reducer;
