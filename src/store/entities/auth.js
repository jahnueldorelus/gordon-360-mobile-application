import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "auth",
  initialState: {
    token: {
      data: null,
      loading: false,
      fetchError: false,
    },
    api: "https://360api.gordon.edu",
    apiEndpoint: "/api",
  },
  reducers: {
    // Adds the user token
    tokenAdded: ({ token }, action) => {
      token.data = action.payload.access_token;
      token.fetchError = false;
    },

    // User's token request started
    tokenReqStarted: ({ token }, action) => {
      token.loading = true;
    },

    // User's token request ended
    tokenReqEnded: ({ token }, action) => {
      token.loading = false;
    },

    // User's token request failed
    tokenReqFailed: ({ token }, action) => {
      token.fetchError = true;
      token.data = null;
    },

    // User's token error removed
    tokenErrorReset: ({ token }, action) => {
      token.fetchError = false;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/
/**
 * Returns the user's token
 */
export const getToken = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.token.data
);

/**
 * Returns the token's error status
 */
export const getTokenError = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.token.fetchError
);

/**
 * Returns the token's loading status
 */
export const getTokenLoading = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.token.loading
);

/**
 * Returns the API source
 */
export const getAPI = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.api
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * Fetches the user's token
 * @param {String} username The user's username
 * @param {String} password The user's password
 * @returns An action of fetching the user's token
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
 * Resets the token error
 * @returns An action of resetting the token error
 */
export const resetTokenError = () => (dispatch, getState) => {
  dispatch({ type: slice.actions.tokenErrorReset.type });
};
