import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "../middleware/api";
import notification from "../middleware/notification";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

const store = configureStore({
  reducer,
  middleware: [thunk, api, notification],
});

const persistor = persistStore(store);

export { store, persistor };
