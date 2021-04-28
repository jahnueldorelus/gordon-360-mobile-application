import { ent_AuthResetState } from "../../store/entities/Auth/auth";
import {
  ent_ChatResetState,
  ent_ChatFetchAllData,
} from "../../store/entities/chat";
import {
  ent_SettingsResetState,
  ent_SettingsFetchAllData,
} from "../../store/entities/Settings/settings";
import {
  ent_ProfileResetState,
  ent_ProfileResetExceptUserProfile,
  ent_ProfileFetchAllData,
  ent_ProfileFetchAllDataAfterLogIn,
} from "../../store/entities/profile";
import { ui_ChatResetState } from "../../store/ui/chat";
import { ui_PeopleSearchResetState } from "../../store/ui/peopleSearch";
import { ui_PeopleSearchFilterResetState } from "../../store/ui/peopleSearchFilter";
import AsyncStorage from "@react-native-community/async-storage";

/**
 * Fetches all data used by the application from the server
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                all data has been deleted
 */
export const fetchAllAppData = (dispatch, callbackFunc) => {
  dispatch(ent_ChatFetchAllData);
  dispatch(ent_SettingsFetchAllData);
  dispatch(ent_ProfileFetchAllData);
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};

/**
 * Fetches all data used by the application from the server
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                all data has been deleted
 */
export const fetchAllAppDataAfterLogIn = (dispatch, callbackFunc) => {
  dispatch(ent_ChatFetchAllData);
  dispatch(ent_SettingsFetchAllData);
  dispatch(ent_ProfileFetchAllDataAfterLogIn);
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};

/**
 * Resets the entire application.
 * Deletes all data saved in the Redux state (except for authorization)
 * and in storage.
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                all data has been deleted
 */
export const resetApp = (dispatch, callbackFunc) => {
  dispatch(ent_ChatResetState);
  dispatch(ent_SettingsResetState);
  dispatch(ent_ProfileResetExceptUserProfile);
  dispatch(ui_ChatResetState);
  dispatch(ui_PeopleSearchResetState);
  dispatch(ui_PeopleSearchFilterResetState);

  // Resets storage
  AsyncStorage.clear().then(() => {
    // Calls callback function if available
    if (callbackFunc) callbackFunc();
  });
};

/**
 * Signs out the current user.
 * Deletes all data saved in the Redux state and in storage.
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                all data has been deleted
 */
export const signOutApp = (dispatch, callbackFunc) => {
  // Resets Redux State
  dispatch(ent_AuthResetState);
  dispatch(ent_ChatResetState);
  dispatch(ent_SettingsResetState);
  dispatch(ent_ProfileResetState);
  dispatch(ui_ChatResetState);
  dispatch(ui_PeopleSearchResetState);
  dispatch(ui_PeopleSearchFilterResetState);

  // Resets storage
  AsyncStorage.clear().then(() => {
    // Calls callback function if available
    if (callbackFunc) callbackFunc();
  });
};
