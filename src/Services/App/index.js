import { ent_AuthResetState } from "../../store/entities/Auth/auth";
import { ent_ChatResetState } from "../../store/entities/chat";
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
import { ui_ChatResetState } from "../../store/ui/Chat/chat";
import { ui_PeopleSearchResetState } from "../../store/ui/peopleSearch";
import { ui_PeopleSearchFilterResetState } from "../../store/ui/peopleSearchFilter";
import { ui_AppResetState } from "../../store/ui/app";
import { deleteSavedImages } from "../../Services/Messages/index";
import AsyncStorage from "@react-native-community/async-storage";
import { persistor } from "../../store/configuration/configureStore";

/**
 * Fetches all data used by the application from the server
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after the user's
 *                                data has begun the process of retrieval
 */
export const fetchAllAppData = (dispatch, callbackFunc) => {
  dispatch(ent_SettingsFetchAllData);
  dispatch(ent_ProfileFetchAllData);
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};

/**
 * Fetches data used by the application from the server. Not all data is
 * fetched as some data requires other data to be previously fetched first.
 * Therefore, some data will only be fetched when the user enters the screen
 * that requires it.
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after the user's
 *                                data has begun the process of retrieval
 */
export const fetchAppDataAfterLogIn = (dispatch, callbackFunc) => {
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
 * @param {boolean} saveCurrentState Determines if the state should be saved
 *                                   after deleting data. This would allow
 *                                   for specific states to remain saved such
 *                                   as the user's authentication.
 * @param {Function} callbackFunc A callback function that runs after
 *                                data has been deleted
 */
export const resetApp = (dispatch, saveCurrentState, callbackFunc) => {
  dispatch(ent_ChatResetState());
  dispatch(ent_SettingsResetState);
  dispatch(ent_ProfileResetExceptUserProfile);
  dispatch(ui_ChatResetState);
  dispatch(ui_PeopleSearchResetState());
  dispatch(ui_PeopleSearchFilterResetState());
  dispatch(ui_AppResetState);

  // Deletes all chat images saved to the device
  deleteSavedImages();
  // Resets storage
  AsyncStorage.clear();
  // Resets redux persist
  persistor.purge();
  // Saves the state to redux persist immediately
  if (saveCurrentState) persistor.flush();
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};

/**
 * Resets all UI data.
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                data has been deleted
 */
export const resetUI = (dispatch, callbackFunc) => {
  dispatch(ui_ChatResetState);
  dispatch(ui_PeopleSearchResetState());
  dispatch(ui_PeopleSearchFilterResetState());
  dispatch(ui_AppResetState);
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};

/**
 * Signs out the current user.
 * Deletes all data saved in the Redux state and in storage.
 * @param {Function} dispatch Redux dispatch
 * @param {Function} callbackFunc A callback function that runs after
 *                                data has been deleted
 */
export const signOutApp = (dispatch, callbackFunc) => {
  // Resets Redux State
  dispatch(ent_AuthResetState);
  dispatch(ent_ChatResetState());
  dispatch(ent_SettingsResetState);
  dispatch(ent_ProfileResetState);
  dispatch(ui_ChatResetState);
  dispatch(ui_PeopleSearchResetState());
  dispatch(ui_PeopleSearchFilterResetState());
  dispatch(ui_AppResetState);

  // Deletes all chat images saved to the device
  deleteSavedImages();
  // Resets storage
  AsyncStorage.clear();
  // Resets redux persist
  persistor.purge();
  // Calls callback function if available
  if (callbackFunc) callbackFunc();
};
