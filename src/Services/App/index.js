import { store } from "../../store/configuration/configureStore";
import { ent_AuthResetState } from "../../store/entities/auth";
import { ent_ChatResetState } from "../../store/entities/chat";
import { ent_ProfileResetState } from "../../store/entities/profile";
import { ui_ChatResetState } from "../../store/ui/chat";
import { ui_PeopleSearchResetState } from "../../store/ui/peopleSearch";
import { ui_PeopleSearchFilterResetState } from "../../store/ui/peopleSearchFilter";
import AsyncStorage from "@react-native-community/async-storage";

/**
 * Resets the entire application.
 * Deletes all data saved in the Redux state
 * and in storage.
 * @param {Function} callbackFunc A callback function that runs after
 *                                all data has been deleted
 */
export const resetApp = (callbackFunc) => {
  // Resets Redux State
  store.dispatch(ent_AuthResetState);
  store.dispatch(ent_ChatResetState);
  store.dispatch(ent_ProfileResetState);
  store.dispatch(ui_ChatResetState);
  store.dispatch(ui_PeopleSearchResetState);
  store.dispatch(ui_PeopleSearchFilterResetState);

  // Resets storage
  AsyncStorage.clear().then(() => {
    // Calls callback function if available
    if (callbackFunc) callbackFunc();
  });
};
