import { createSlice } from "@reduxjs/toolkit";
import { getReadableDateFormat } from "../../../Services/Messages/index";
import { apiRequested } from "../../middleware/api";
import { get360URL } from "../Auth/authSelectors";

/*********************************** SLICE ***********************************/
export const slice = createSlice({
  name: "settings",
  initialState: {
    gordon_360_site: {
      isWorking: false,
      lastCheckedDate: null,
      reqPending: false,
    },
    gordon_360_server: {
      isWorking: false,
      lastCheckedDate: null,
      reqPending: false,
    },
    useHapticsWhileTexting: false,
  },
  reducers: {
    /**
     * GORDON 360 SITE REDUCER
     */
    // Adds the status of Gordon 360
    add360SiteStatus: (state, action) => {
      state.gordon_360_site.isWorking =
        // If there's no status, then the fetch failed
        action.status
          ? // If the status is between 200-299, the status is good. Otherwise, it's bad
            action.status >= 200 && action.status < 300
            ? true
            : false
          : false;
      state.gordon_360_site.lastCheckedDate = getReadableDateFormat(new Date());
    },

    // Saves that the request for the status of the site started
    req360SiteStarted: (state, action) => {
      state.gordon_360_site.reqPending = true;
    },

    // Saves that the request for the status of the site ended
    req360SiteEnded: (state, action) => {
      state.gordon_360_site.reqPending = false;
    },

    /**
     * GORDON 360 SERVER REDUCER
     */
    // Adds the user token
    add360ServerStatus: (state, action) => {
      state.gordon_360_server.isWorking =
        // If there's no status, then the fetch failed
        action.status
          ? // If the status is between 200-299, the status is good. Otherwise, it's bad
            action.status >= 200 && action.status < 300
            ? true
            : false
          : false;
      state.gordon_360_server.lastCheckedDate = getReadableDateFormat(
        new Date()
      );
    },

    // Saves that the request for the status of the server started
    req360ServerStarted: (state, action) => {
      state.gordon_360_server.reqPending = true;
    },

    // Saves that the request for the status of the server ended
    req360ServerEnded: (state, action) => {
      state.gordon_360_server.reqPending = false;
    },

    /**
     * TEXT HAPTICS REDUCER
     */
    // Sets the haptics value
    setHaptics: (state, action) => {
      state.useHapticsWhileTexting = action.payload;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.gordon_360_site = {
        isWorking: false,
        lastCheckedDate: null,
        reqPending: false,
      };
      state.gordon_360_server = {
        isWorking: false,
        lastCheckedDate: null,
        reqPending: false,
      };
      state.useHapticsWhileTexting = false;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/**
 * Fetches the status of Gordon 360's Site
 */
export const fetchGordon360SiteStatus = (dispatch, getState) => {
  dispatch(
    apiRequested({
      baseUrl: get360URL(getState()),
      url: "",
      method: "get",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Content-Type": "text/html",
      },
      onStart: slice.actions.req360SiteStarted.type,
      onSuccess: slice.actions.add360SiteStatus.type,
      onError: slice.actions.add360SiteStatus.type,
      onEnd: slice.actions.req360SiteEnded.type,
    })
  );
};

/**
 * Fetches the status of Gordon 360's Site
 */
export const fetchGordon360ServerStatus = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/profiles",
      useEndpoint: true,
      method: "get",
      onStart: slice.actions.req360ServerStarted.type,
      onSuccess: slice.actions.add360ServerStatus.type,
      onError: slice.actions.add360ServerStatus.type,
      onEnd: slice.actions.req360ServerEnded.type,
    })
  );
};

/**
 * Sets the use of haptics while texiting
 * @param {boolean} useHaptics Determines if the haptics should be used
 */
export const setHapticsForTexting = (useHaptics) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setHaptics.type, payload: useHaptics });
};

/**
 * Resets all the state's data
 */
export const ent_SettingsResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};

/**
 * Fetches all data used by this slice from the server
 */
export const ent_SettingsFetchAllData = (dispatch, getState) => {
  dispatch(fetchGordon360SiteStatus);
  dispatch(fetchGordon360ServerStatus);
};
