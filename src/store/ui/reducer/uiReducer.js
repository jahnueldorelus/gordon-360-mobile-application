import { combineReducers } from "redux";
import appReducer from "../app";
import chatReducer from "../Chat/chat";
import peopleSearchReducer from "../peopleSearch";
import peopleSearchFilterReducer from "../peopleSearchFilter";

export default combineReducers({
  app: appReducer,
  chat: chatReducer,
  peopleSearch: peopleSearchReducer,
  peopleSearchFilter: peopleSearchFilterReducer,
});
