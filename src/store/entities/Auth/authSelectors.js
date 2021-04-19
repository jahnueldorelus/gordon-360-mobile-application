import { createSelector } from "reselect";

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
 * Returns the user's Expo token
 */
export const getExpoToken = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.expoToken.data
);

/**
 * Returns the user's Expo token saved to server property
 */
export const getExpoTokenAlreadySent = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.expoToken.savedToServer
);

/**
 * Returns the user's Expo tokens saved on the server
 */
export const getListOfExpoTokens = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.expoToken.listOfServerIDs
);

/**
 * Returns the API source
 */
export const getAPI = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.api
);

/**
 * Returns the API's endpoint
 */
export const getAPIEndpoint = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.apiEndpoint
);

/**
 * Returns Gordon 360's site URL
 */
export const get360URL = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.website
);
