import axios from "axios";
import { createAction } from "@reduxjs/toolkit";

// Request Action Creator
export const pushRemoteNotification = createAction(
  "notification/pushRemoteNotification"
);

// API Middleware
export default ({ dispatch, getState }) => (next) => async (action) => {
  // Passes along action to next middleware if a push notification call is not requested
  if (action.type !== pushRemoteNotification.type) return next(action);

  // Constants from the action's payload
  const {
    data,
    title,
    body,
    onStart,
    onEnd,
    onSuccess,
    onError,
  } = action.payload;

  // Calls the onStart action if available
  if (onStart) dispatch({ type: onStart });

  // Passes API call to be visible in redux tools
  next(action);

  // Creates Expo's Push Notification Server request headers
  const getHeaders = {
    Accept: "application/json",
    "Accept-encoding": "gzip, deflate",
    "Content-Type": "application/json",
  };

  /**
   * Creates the messge for the Expo server to parse.
   */
  const message = {
    // Jahnuel's iPhone XR
    to: "ExponentPushToken[uJBJ65P03tj39vXo-R9joJ]",
    // Jahnuel's iPhone 6S
    // to: "ExponentPushToken[DHQsffOcITbrRWiTFUNGNy]",
    data,
    // Caps the title to a length of 40 characters
    title: title.length > 40 ? `${title.slice(0, 37)}...` : title,
    // Caps the body to a length of 180 characters
    body: body.length > 180 ? `${body.slice(0, 177)}...` : body,
    sound: "default",
  };

  // Attempts API Call
  try {
    // The request
    const response = await axios({
      url: "https://exp.host/--/api/v2/push/send",
      method: "POST",
      data: JSON.stringify(message),
      headers: getHeaders,
    });
    // Calls the onSuccess action if available and if response was received successfully
    if (onSuccess)
      dispatch({
        type: onSuccess,
        payload: response.data,
        config: response.config,
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
