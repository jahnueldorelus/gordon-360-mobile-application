import axios from "axios";
import { createAction } from "@reduxjs/toolkit";
import {
  getToken,
  getAPI,
  getAPIEndpoint,
} from "../entities/Auth/authSelectors";

// Request Action Creator
export const apiRequested = createAction("api/Requested");

// API Middleware
export default ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    // Passes along action to next middleware if an api call is not requested
    if (action.type !== apiRequested.type) return next(action);

    // Constants from the action's payload
    const {
      baseUrl,
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
      successCallback,
    } = action.payload;

    // Calls the onStart action if available
    if (onStart) dispatch({ type: onStart, passedData });

    // Passes API call to be visible in redux tools
    next(action);

    // Creates the API's request headers
    const getHeaders = headers
      ? headers
      : {
          Accept: "application/json",
          Authorization: `Bearer ${getToken(getState())}`,
          "Content-Type": "application/json",
        };

    // Creates the new baseURL
    const newBaseURL = baseUrl ? baseUrl : getAPI(getState());
    // Creates the new URL
    const newURL = useEndpoint ? getAPIEndpoint(getState()) + url : url;

    // Attempts API Call
    try {
      // The request
      const response = await axios({
        baseURL: newBaseURL,
        url: newURL,
        method,
        data,
        headers: getHeaders,
      });

      // Calls the onSuccess action if available and if response was received successfully
      if (onSuccess)
        dispatch({
          type: onSuccess,
          payload: response.data,
          config: response.config,
          status: response.status,
          passedData,
        });

      // Calls the successCallback function if available and if response was received successfully
      if (successCallback)
        successCallback(
          {
            type: onSuccess,
            payload: response.data,
            config: response.config,
            status: response.status,
            passedData,
          },
          dispatch
        );
    } catch (error) {
      /**
       * Calls the onError action if available and if an error occured
       * and the data is not in storage
       */
      if (onError)
        dispatch({
          type: onError,
          payload: { error: JSON.stringify(error) },
          passedData,
          url: newBaseURL + newURL,
        });
    }

    // Calls the onEnd action if available
    if (onEnd) dispatch({ type: onEnd, passedData });
  };
