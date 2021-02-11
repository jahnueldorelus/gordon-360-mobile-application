import { combineReducers } from "redux";
import entitiesReducer from "../entities/reducer/entitiesReducer";
import uiReducer from "../ui/reducer/uiReducer";

export default combineReducers({
  entities: entitiesReducer,
  ui: uiReducer,
});
