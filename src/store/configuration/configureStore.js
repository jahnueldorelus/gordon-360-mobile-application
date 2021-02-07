import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "../middleware/api";
import { createMigrate, persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import thunk from "redux-thunk";

// New reducer version
const newVersion = 2;

/**
 * Redux-Persist Migration of state
 * This variable is incredibly important. It handles the migration of the
 * state from storage upon app load. Through this, you can change the structure
 * of the state from storage to fit the new structure of the reducer's initial state.
 * More info can be found in documentation
 */
const migration = {
  // New migration of state. Property name must match new state version!!
  [newVersion]: (state) => {
    return {
      ...state,
    };
  },
};

// Redux-Persist Config
const persistConfig = {
  key: "store",
  version: newVersion,
  storage: AsyncStorage,
  timeout: 0,
  migrate: createMigrate(migration, { debug: true }),
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: [thunk, api],
});

const persistor = persistStore(store);

export { store, persistor };
