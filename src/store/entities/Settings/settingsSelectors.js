import { createSelector } from "reselect";

/**
 * Returns Gordon 360's Site Status
 */
export const get360SiteStatus = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_site.isWorking
);

/**
 * Returns Gordon 360's Site's Request Pending Status
 */
export const get360SitePending = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_site.reqPending
);

/**
 * Returns Gordon 360's Site last checked date
 */
export const get360SiteLastCheckedDate = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_site.lastCheckedDate
);

/**
 * Returns Gordon 360's Server Status
 */
export const get360ServerStatus = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_server.isWorking
);

/**
 * Returns Gordon 360's Server's Request Pending Status
 */
export const get360ServerPending = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_server.reqPending
);

/**
 * Returns Gordon 360's Server last checked date
 */
export const get360ServerLastCheckedDate = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.gordon_360_server.lastCheckedDate
);

/**
 * Returns the status of using haptics for texting
 */
export const getUseHapticsForTexting = createSelector(
  (state) => state.entities.settings,
  (settings) => settings.useHapticsWhileTexting
);
