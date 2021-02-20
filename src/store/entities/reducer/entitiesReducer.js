import { combineReducers } from "redux";
import profileReducer from "../profile";
import authReducer from "../auth";
import chatReducer from "../chat";
import peopleSearchReducer from "../peopleSearch";

export default combineReducers({
  profile: profileReducer,
  auth: authReducer,
  chat: chatReducer,
  peopleSearch: peopleSearchReducer,
});
