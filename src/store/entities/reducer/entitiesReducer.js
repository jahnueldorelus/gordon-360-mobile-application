import { combineReducers } from "redux";
import profileReducer from "../profile";
import authReducer from "../auth";
import chatReducer from "../chat";

export default combineReducers({
  profile: profileReducer,
  auth: authReducer,
  chat: chatReducer,
});
