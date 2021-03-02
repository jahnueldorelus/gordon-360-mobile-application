import { combineReducers } from "redux";
import chatReducer from "../chat";
import peopleSearchReducer from "../peopleSearch";
import peopleSearchFilterReducer from "../peopleSearchFilter";

export default combineReducers({
  chat: chatReducer,
  peopleSearch: peopleSearchReducer,
  peopleSearchFilter: peopleSearchFilterReducer,
});
