import axios from "axios";
import { createAction } from "@reduxjs/toolkit";

// Request Action Creator
export const apiRequested = createAction("api/Requested");

// API Middleware
export default ({ dispatch, getState }) => (next) => async (action) => {
  // Passes along action to next middleware if an api call is not requested
  if (action.type !== apiRequested.type) return next(action);

  // Constants from the action's payload
  const {
    url,
    method,
    data,
    headers,
    onStart,
    onEnd,
    onSuccess,
    onError,
    useEndpoint,
    passedData,
  } = action.payload;

  // Calls the onStart action if available
  if (onStart) dispatch({ type: onStart });

  // Passes API call to be visible in redux tools
  next(action);

  // Creates the API's request headers
  const getHeaders = headers
    ? headers
    : {
        Accept: "application/json",
        Authorization: `Bearer ${getState().entities.auth.token.data}`,
        "Content-Type": "application/json",
      };

  // Attempts API Call
  try {
    console.log("Requested:", url);

    // The request
    const response = await axios({
      baseURL: getState().entities.auth.api,
      url: useEndpoint ? getState().entities.auth.apiEndpoint + url : url,
      method,
      data,
      headers: getHeaders,
      onSuccess,
      onError,
    });

    // Calls the onSuccess action if available and if response was received successfully
    if (onSuccess)
      dispatch({
        type: onSuccess,
        payload: response.data,
        config: response.config,
        passedData,
      });
  } catch (error) {
    /**
     * Calls the onError action if available and if an error occured
     * and the data is not in storage
     */
    if (onError)
      dispatch({ type: onError, payload: { error: JSON.stringify(error) } });
  }

  // Calls the onEnd action if available
  if (onEnd) dispatch({ type: onEnd });
};
