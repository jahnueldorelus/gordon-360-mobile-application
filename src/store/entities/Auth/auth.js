import { createSlice } from "@reduxjs/toolkit";
import { apiRequested } from "../../middleware/api";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "auth",
  initialState: {
    token: {
      data: null,
      loading: false,
      fetchError: false,
    },
    expoToken: null,
    api: "https://360apitrain.gordon.edu",
    website: "https://360train.gordon.edu",
    apiEndpoint: "/api",
  },
  reducers: {
    /**
     * TOKEN REDUCERS
     */
    // Adds the user token
    tokenAdded: (state, action) => {
      state.token.data = action.payload.access_token;
      state.token.fetchError = false;
    },

    // User's token request started
    tokenReqStarted: (state, action) => {
      state.token.loading = true;
    },

    // User's token request ended
    tokenReqEnded: (state, action) => {
      state.token.loading = false;
    },

    // User's token request failed
    tokenReqFailed: (state, action) => {
      state.token.fetchError = true;
      state.token.data = null;
    },

    // User's token error removed
    tokenErrorReset: (state, action) => {
      state.token.fetchError = false;
    },

    /**
     * EXPO TOKEN REDUCER
     */
    // Adds the user expo token
    expoTokenAdded: (state, action) => {
      state.expoToken = action.payload.expoToken;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.token = {
        data: null,
        loading: false,
        fetchError: false,
      };
      state.expoToken = null;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** ACTION CREATORS ***********************************/
/**
 * Fetches the user's token
 * @param {String} username The user's username
 * @param {String} password The user's password
 */
export const fetchToken = (username = "", password = "") => (
  dispatch,
  getState
) => {
  dispatch(
    apiRequested({
      url: "/token",
      method: "post",
      data: `username=${
        // If the username contains '@gordon.edu', the address is removed since
        // '@gordon.edu' is not needed for authentication
        username.endsWith("@gordon.edu") ? username.split("@")[0] : username
      }&password=${password}&grant_type=password`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      onSuccess: slice.actions.tokenAdded.type,
      onStart: slice.actions.tokenReqStarted.type,
      onEnd: slice.actions.tokenReqEnded.type,
      onError: slice.actions.tokenReqFailed.type,
    })
  );
};

/**
 * Set's the user's Expo token
 * @param {String} expoToken The user's expo token
 */
export const setExpoToken = (expoToken) => (dispatch, getState) => {
  dispatch({ type: slice.actions.expoTokenAdded.type, payload: { expoToken } });
};

/**
 * Resets the token error
 * @returns An action of resetting the token error
 */
export const resetTokenError = () => (dispatch, getState) => {
  dispatch({ type: slice.actions.tokenErrorReset.type });
};

/**
 * Resets all the state's data
 */
export const ent_AuthResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};
