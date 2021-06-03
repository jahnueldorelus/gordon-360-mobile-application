import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "app",
  initialState: {
    currentOrientation: null,
    appbarHeight: 0,
  },
  reducers: {
    /**
     *  Orientation Reducer
     */
    // Sets the device's orientation
    setDeviceOrientation: (state, action) => {
      state.currentOrientation = action.payload;
    },

    /**
     *  Appbar Reducer
     */
    // Sets the appbar height
    setAppbarHeight: (state, action) => {
      state.appbarHeight = action.payload;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the device's current orientation
 */
export const setDeviceOrientation = createAction(
  slice.actions.setDeviceOrientation.type
);
/**
 * Sets the appbar height
 */
export const setAppbarHeight = createAction(slice.actions.setAppbarHeight.type);

/*********************************** SELECTORS ***********************************/
/**
 * Returns the device's current orientation
 */
export const getDeviceOrientation = createSelector(
  (state) => state.ui.app,
  (app) => app.currentOrientation
);

/**
 * Returns the appbar height
 */
export const getAppbarHeight = createSelector(
  (state) => state.ui.app,
  (app) => app.appbarHeight
);
