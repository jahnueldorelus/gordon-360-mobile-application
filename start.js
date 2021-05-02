import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { sendExpoTokenToServer } from "./src/store/entities/Auth/auth";
import {
  getExpoToken,
  getToken,
  get360URL,
} from "./src/store/entities/Auth/authSelectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppDataAfterLogIn } from "./src/Services/App/index";
import { NetworkProvider } from "react-native-offline";
import { Screen } from "./screen";
import { ScreenNames } from "./ScreenNames";

export const Start = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Navigators
  const Drawer = createDrawerNavigator();
  // Gordon 360 URL
  const gordon360URL = useSelector(get360URL);
  // The main user's Gordon 360 token
  const authToken = useSelector(getToken);
  // The main user's Expo token
  const expoToken = useSelector(getExpoToken);

  useEffect(() => {
    /**
     * If the user is logged in and they have their Expo token,
     * their Expo token is sent to the server
     */
    if (authToken && expoToken) {
      dispatch(sendExpoTokenToServer);
    }
    // If the user is logged in, all of their data is fetched
    if (authToken) {
      fetchAppDataAfterLogIn(dispatch);
    }
  }, [authToken]);

  // Returns a screen based upon the current route
  const AppScreen = ({ route }) => {
    if (route.name === ScreenNames.gordon360) {
      return <Screen screenName={ScreenNames.gordon360} />;
    } else if (route.name === ScreenNames.messages)
      return <Screen screenName={ScreenNames.messages} />;
    else if (route.name === ScreenNames.profile)
      return <Screen screenName={ScreenNames.profile} />;
    else if (route.name === ScreenNames.settings)
      return <Screen screenName={ScreenNames.settings} />;
    else if (route.name === ScreenNames.login)
      return <Screen screenName={ScreenNames.login} />;
  };

  const InitialView = () => {
    if (authToken) {
      return (
        <Drawer.Navigator
          initialRouteName={ScreenNames.gordon360}
          drawerType="slide"
        >
          <Drawer.Screen
            name={ScreenNames.gordon360}
            component={AppScreen}
            /**
             * Prevent users from accessing the drawer navigator using gestures
             * Since the WebView uses gestures for navigating through the browser's
             * history, the drawer navigator interferes with swiping gesture to go back a page
             */
            options={{ swipeEnabled: false }}
          />
          <Drawer.Screen name={ScreenNames.messages} component={AppScreen} />
          <Drawer.Screen name={ScreenNames.profile} component={AppScreen} />
          <Drawer.Screen name={ScreenNames.settings} component={AppScreen} />
        </Drawer.Navigator>
      );
    } else {
      return (
        <Drawer.Navigator
          initialRouteName={ScreenNames.login}
          drawerType="slide"
        >
          <Drawer.Screen
            name={ScreenNames.login}
            component={AppScreen}
            /**
             * Prevent users from accessing the drawer navigator using gestures
             */
            options={{ swipeEnabled: false }}
          />
        </Drawer.Navigator>
      );
    }
  };

  return (
    <NetworkProvider pingServerUrl={gordon360URL}>
      {InitialView()}
    </NetworkProvider>
  );
};
