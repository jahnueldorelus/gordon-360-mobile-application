import { combineReducers } from "redux";
import profileReducer from "../profile";
import authReducer from "../Auth/auth";
import chatReducer from "../chat";
import settingsReducer from "../Settings/settings";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

// Redux-Persist Config
const persistConfig = {
  key: "entities",
  storage: AsyncStorage,
};

export default persistReducer(
  persistConfig,
  combineReducers({
    profile: profileReducer,
    auth: authReducer,
    chat: chatReducer,
    settings: settingsReducer,
  })
);
