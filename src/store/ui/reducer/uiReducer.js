import { combineReducers } from "redux";
import chatReducer from "../chat";

export default combineReducers({
  chat: chatReducer,
});
