import { createSlice, createAction } from "@reduxjs/toolkit";
import { apiRequested } from "../../middleware/api";
import { getExpoToken, getListOfExpoTokens } from "./authSelectors";
import { getUserInfo } from "../profile";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "auth",
  initialState: {
    token: {
      data: null,
      loading: false,
      fetchError: false,
    },
    expoToken: {
      data: null,
      listOfServerIDs: [],
      deletedFromServer: null,
    },
    api: "https://360apitrain.gordon.edu",
    website: "https://360.gordon.edu",
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
      state.expoToken.data = action.payload.expoToken;
    },
    // Adds the user's list of tokens
    expoTokenIDsAdded: (state, action) => {
      state.expoToken.listOfServerIDs = action.payload[0].map(
        (user) => user.connection_id
      );
    },
    // Handles the response of an expo token deletion attempt from the server
    expoTokenDeletedFromServer: (state, action) => {
      // The action's payload is either true or false
      if (action.payload === true) {
        state.expoToken.deletedFromServer = true;
      } else {
        state.expoToken.deletedFromServer = false;
      }
    },
    // Resets expo token's deleted from server property
    expoTokenDeleteReset: (state, action) => {
      state.expoToken.deletedFromServer = null;
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
      state.expoToken = {
        data: null,
        listOfServerIDs: [],
      };
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
export const fetchToken =
  (username = "", password = "") =>
  (dispatch, getState) => {
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
 * Sends the Expo token to the server
 */
export const sendExpoTokenToServer = (dispatch, getState) => {
  // The curerntly saved Expo Token
  const savedExpoToken = getExpoToken(getState());
  // The main user's list of Expo tokens saved on the server
  const listOfExpoTokens = getListOfExpoTokens(getState());

  /**
   * Sends the Expo token to the server if the token isn't included
   * in the list of the user's Expo tokens on the server
   */
  if (!listOfExpoTokens.includes(savedExpoToken)) {
    // Sends the request
    dispatch(
      apiRequested({
        url: "/dm/userConnectionIds",
        method: "post",
        data: JSON.stringify(savedExpoToken),
        useEndpoint: true,
      })
    );
  }

  // Gets the list of the user's Expo tokens
  dispatch(fetchListOfExpoTokens);
};

/**
 * Deletes the Expo token from the server
 */
export const deleteExpoTokenFromServer = (dispatch, getState) => {
  // The curerntly saved Expo Token
  const savedExpoToken = getExpoToken(getState());

  // Sends the request to delete the Expo token
  dispatch(
    apiRequested({
      url: "/dm/deleteUserConnectionIds",
      method: "put",
      data: JSON.stringify(savedExpoToken),
      useEndpoint: true,
      onSuccess: slice.actions.expoTokenDeletedFromServer.type,
      onError: slice.actions.expoTokenDeletedFromServer.type,
    })
  );

  // Gets the list of the user's Expo tokens
  dispatch(fetchListOfExpoTokens);
};

/**
 * Resets the expo token deleted from the server property
 */
export const resetExpoTokenDeletion = createAction(
  slice.actions.expoTokenDeleteReset.type
);

/**
 * Gets the Expo token connection IDs of the user
 */
export const fetchListOfExpoTokens = (dispatch, getState) => {
  // Checks to make sure the user id is available before attempting to retrieve it
  if (getUserInfo(getState())) {
    // The main user's ID
    const userID = getUserInfo(getState()).ID;

    // Sends the request
    dispatch(
      apiRequested({
        url: "/dm/userConnectionIds",
        method: "put",
        data: [userID],
        useEndpoint: true,
        onSuccess: slice.actions.expoTokenIDsAdded.type,
      })
    );
  }
};

/**
 * Set's the user's Expo token if the Expo token is not the same
 * as the current token saved.
 * @param {String} expoToken The user's expo token
 */
export const setExpoToken = (expoToken) => (dispatch, getState) => {
  // The curerntly saved Expo Token
  const savedExpoToken = getExpoToken(getState());

  // Saves the token if it's not the same as the current token and is defined
  if (savedExpoToken !== expoToken && expoToken)
    dispatch({
      type: slice.actions.expoTokenAdded.type,
      payload: { expoToken },
    });
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
