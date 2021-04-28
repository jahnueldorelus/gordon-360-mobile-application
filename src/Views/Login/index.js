import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-elements";
import { Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { fetchToken, resetTokenError } from "../../store/entities/Auth/auth";
import {
  getToken,
  getTokenError,
  getTokenLoading,
} from "../../store/entities/Auth/authSelectors";
import { fetchProfile } from "../../store/entities/profile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const Login = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // App Navigation
  const navigation = useNavigation();

  // The user's token
  const token = useSelector(getToken);
  // The token's error status
  const tokenError = useSelector(getTokenError);
  // The token's loading status
  const tokenLoading = useSelector(getTokenLoading);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailedText, setLoginFailedText] = useState(null);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [usernameHighlighted, setUsernameHighlighted] = useState(false);
  const [passwordHighlighted, setPasswordHighlighted] = useState(false);
  const secondTextField = useRef(null);

  // Gets the user's profile after fetching their token and handles if the fetch fails
  useEffect(() => {
    if (!tokenLoading) {
      if (token) {
        dispatch(fetchProfile);
        // Deletes any sensitive information saved in the state
        setUsername("");
        setPassword("");
        setLoginFailedText("");
      } else if (tokenError) {
        dispatch(resetTokenError());
        // Sets the login as failed
        setLoginFailedText("Invalid email or password");
      }
    }
  }, [token, tokenError, tokenLoading]);

  /**
   * Gets the token from the back-end
   */
  const getAuthorized = () => {
    dispatch(fetchToken(username, password));
  };

  return (
    <LinearGradient colors={["#014983", "#00AEEF"]} style={styles.gradient}>
      <StatusBar barStyle="light-content" translucent />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.KeyboardAvoidingView}
          behavior={Platform.OS == "ios" ? "padding" : null}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.loginScrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <SafeAreaView style={styles.login}>
              <View
                style={[
                  styles.loginInput,
                  {
                    marginTop:
                      Platform.OS === "android" ? StatusBar.currentHeight : 0,
                  },
                ]}
              >
                <Image
                  style={styles.loginLogo}
                  source={require("./Images/logo.png")}
                />
                <Input
                  leftIcon={{
                    type: "material",
                    name: "email",
                    color: styles.loginTextIcon.color,
                  }}
                  placeholder="firstname.lastname"
                  placeholderTextColor={
                    styles.loginTextboxInputTextPlaceholder.color
                  }
                  onChangeText={(text) => {
                    // Saves the inputted username
                    setUsername(text);
                    // Enables the login button if both username and password are not empty
                    // Also removes the login failed text
                    if (text.length > 0 && password) {
                      setLoginDisabled(false);
                      setLoginFailedText("");
                    } else {
                      setLoginDisabled(true);
                      // Removes the failed text only if error is specifically for the username textfield
                      if (usernameHighlighted && !passwordHighlighted) {
                        setLoginFailedText("");
                      }
                    }
                    // Removes the highlights if visible
                    setUsernameHighlighted(false);
                  }}
                  enablesReturnKeyAutomatically
                  underlineColorAndroid="transparent"
                  keyboardAppearance={"default"}
                  keyboardType="email-address"
                  returnKeyType="next"
                  textContentType="username"
                  value={username}
                  label={usernameHighlighted ? "Username *" : "Username"}
                  containerStyle={styles.loginTextboxContainer}
                  labelStyle={[
                    styles.loginTextboxInputLabel,
                    {
                      color: usernameHighlighted
                        ? "#FDB913"
                        : "rgba(255, 255, 255, 0.5)",
                    },
                  ]}
                  inputContainerStyle={styles.loginTextboxInputContainer}
                  inputStyle={styles.loginTextboxInputText}
                  onSubmitEditing={() => {
                    // After submitting the username, the password textfield
                    // is automatically focused
                    secondTextField.current.focus();
                  }}
                  blurOnSubmit={false}
                />

                <Input
                  ref={secondTextField}
                  leftIcon={{
                    type: "material",
                    name: "lock",
                    color: styles.loginTextIcon.color,
                  }}
                  placeholder="Password"
                  placeholderTextColor={
                    styles.loginTextboxInputTextPlaceholder.color
                  }
                  onChangeText={(text) => {
                    // Saves the inputted password
                    setPassword(text);
                    // Enables the login button if both username and password are not empty
                    // Also removes the login failed text
                    if (username && text.length > 0) {
                      setLoginDisabled(false);
                      setLoginFailedText("");
                    } else {
                      setLoginDisabled(true);
                      // Removes the failed text only if error is specifically for the password textfield
                      if (passwordHighlighted && !usernameHighlighted) {
                        setLoginFailedText("");
                      }
                    }

                    // Removes the highlights if visible
                    setPasswordHighlighted(false);
                  }}
                  enablesReturnKeyAutomatically
                  underlineColorAndroid="transparent"
                  keyboardAppearance={"default"}
                  keyboardType="default"
                  returnKeyType="go"
                  secureTextEntry
                  selectTextOnFocus
                  textContentType="password"
                  value={password}
                  label={passwordHighlighted ? "Password *" : "Password"}
                  containerStyle={styles.loginTextboxContainer}
                  labelStyle={[
                    styles.loginTextboxInputLabel,
                    {
                      color: usernameHighlighted
                        ? "#FDB913"
                        : "rgba(255, 255, 255, 0.5)",
                    },
                  ]}
                  inputContainerStyle={styles.loginTextboxInputContainer}
                  inputStyle={styles.loginTextboxInputText}
                  onSubmitEditing={() => {
                    if (username && password) {
                      // Does the same with the login button, attemps to authorize the user
                      getAuthorized();
                      // Removes the highlights if visible
                      setUsernameHighlighted(false);
                      setPasswordHighlighted(false);
                    }
                    // Checks to see which textfields are empty and displays an error message accordinly
                    else {
                      // If both textfields are empty
                      if (!username && !password) {
                        setLoginFailedText(
                          "Please enter username and password *"
                        );
                        setPasswordHighlighted(true);
                        setUsernameHighlighted(true);
                      }
                      // If the username textfield is empty
                      else if (!username && password) {
                        setLoginFailedText("Please enter your username *");
                        setUsernameHighlighted(true);
                      }
                      // If the password textfield is empty
                      else {
                        setLoginFailedText("Please enter your password *");
                        setPasswordHighlighted(true);
                      }
                    }
                  }}
                />

                <Text
                  style={[
                    styles.loginFailedText,
                    { display: loginFailedText ? "flex" : "none" },
                  ]}
                >
                  {loginFailedText}
                </Text>
              </View>
              <View style={styles.loginButtonContainer}>
                <Button
                  title="Login"
                  type="solid"
                  titleStyle={styles.loginButtonTextStyle}
                  buttonStyle={styles.loginButtonEnabled}
                  disabledStyle={styles.loginButtonDisabled}
                  loading={tokenLoading}
                  onPress={getAuthorized}
                  disabled={loginDisabled}
                />
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

/**
 * Styles used for this component. This is created inside of the component and
 * not outside because there's a style that required the value of the component's state
 */
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  KeyboardAvoidingView: { flex: 1 },
  login: {
    flex: 1,
    justifyContent: "center",
  },
  loginScrollView: {
    flexGrow: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  loginInput: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  loginLogo: {
    resizeMode: "contain",
    width: 200,
    height: 200,
    marginBottom: 25,
  },
  loginTextIcon: {
    color: "#A9CEFF",
  },
  loginTextboxContainer: {
    maxWidth: 600,
    marginBottom: 10,
  },
  loginTextboxInputLabel: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 18,
  },
  loginTextboxInputContainer: {
    borderRadius: 40,
    backgroundColor: "rgba(160, 172, 186, 0.3)",
    borderBottomWidth: 0,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  loginTextboxInputText: {
    color: "white",
    marginLeft: 5,
  },
  loginTextboxInputTextPlaceholder: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  loginFailedText: {
    fontSize: 17,
    textAlign: "center",
    color: "#FDB913",
    marginBottom: 30,
  },
  loginButtonContainer: {
    width: "100%",
  },
  loginButtonEnabled: {
    borderRadius: 30,
    maxWidth: 250,
    alignSelf: "center",
    backgroundColor: "#014983",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    borderRadius: 30,
    maxWidth: 250,
    alignSelf: "center",
    backgroundColor: "#014983",
    marginBottom: 20,
    opacity: 0.6,
  },
  loginButtonTextStyle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 23,
  },
});
