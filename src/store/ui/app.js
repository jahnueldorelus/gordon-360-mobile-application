import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "app",
  initialState: {
    currentOrientation: null,
    appbarHeight: 0,
    keyboardHeight: 0,
  },
  reducers: {
    /**
     * ORIENTATION REDUCER
     */
    // Sets the device's orientation
    setDeviceOrientation: (state, action) => {
      state.currentOrientation = action.payload;
    },

    /**
     * APPBAR REDUCER
     */
    // Sets the appbar height
    setAppbarHeight: (state, action) => {
      state.appbarHeight = action.payload;
    },

    /**
     *  KEYBOARD REDUCER
     */
    // Sets the device's keyboard height
    setKeyboardHeight: (state, action) => {
      state.keyboardHeight = action.payload;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets important state data
    resetState: (state, action) => {
      state.currentOrientation = null;
      state.appbarHeight = 0;
      state.keyboardHeight = 0;
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

/**
 * Sets the device's keyboard height
 */
export const setKeyboardHeight = createAction(
  slice.actions.setKeyboardHeight.type
);

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

/**
 * Returns the device's keyboard height
 */
export const getKeyboardHeight = createSelector(
  (state) => state.ui.app,
  (app) => app.keyboardHeight
);

/**
 * Resets all the state's data
 */
export const ui_AppResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};
