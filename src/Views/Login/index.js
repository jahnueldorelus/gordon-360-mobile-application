import React, { useState, useRef } from "react";
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
import AsyncStorage from "@react-native-community/async-storage";
import { get } from "../../Services/HTTP/";
import { getUserImage } from "../../Services/Profile";
import { ScrollView } from "react-native-gesture-handler";

export const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginFailedText, setLoginFailedText] = useState(null);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [usernameHighlighted, setUsernameHighlighted] = useState(false);
  const [passwordHighlighted, setPasswordHighlighted] = useState(false);
  const secondTextField = useRef(null);

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
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    loginTextboxInputLabelUsername: {
      color: usernameHighlighted ? "#FDB913" : "rgba(255, 255, 255, 0.5)",
    },
    loginTextboxInputLabelPassword: {
      color: passwordHighlighted ? "#FDB913" : "rgba(255, 255, 255, 0.5)",
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
      display: loginFailedText ? "flex" : "none",
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
  /**
   * Gets the token from the back-end
   */
  async function getAuthorized() {
    // Makes the login button show a loader
    setLoading(true);

    // A fetch request to get the user's token
    await fetch("https://360apitrain.gordon.edu/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${
        // If the username contains '@gordon.edu', the address is removed since
        // '@gordon.edu' is not needed for authentication
        username.endsWith("@gordon.edu") ? username.split("@")[0] : username
      }&password=${password}&grant_type=password`,
    })
      // If a response was returned
      .then((response) => {
        // Parses the response to access data
        response.json().then(async (result) => {
          // If the token is available
          if (result.access_token) {
            // Adds the token to storage
            await AsyncStorage.setItem(
              "token",
              JSON.stringify(result.access_token)
            );
            // Deletes any sensitive information saved in the state
            setUsername("");
            setPassword("");
            setLoginFailedText("");
            // Creates the main user object to be used throughout the components
            let mainUser = {};
            // Gets the user's profile in order to create the main user object
            let userProfile = get("profiles");
            userProfile
              // Adds the user's id and name to the main user object
              .then(async (data) => {
                mainUser._id = data.ID;
                mainUser.name = `${data.FirstName} ${data.LastName}`;
              })
              // Adds the user's image ot the main user object
              .then(async () => {
                // Gets the user's image
                let userImage = await getUserImage();
                mainUser.avatar = userImage;
              })
              // Saves the main user object and navigates to Messages
              .then(async () => {
                // Saves the main user to storage
                await AsyncStorage.setItem("user", JSON.stringify(mainUser));
                // Navigates to the Messages screen
                props.navigation.navigate("Messages");
              });
          }
          // If the token is not available
          else {
            // Sets the login as failed
            setLoginFailedText("Invalid email or password");
          }
        });
        // Stops the login button from showing a loader
        setLoading(false);
      })
      // If the fetch failed, then the login failed
      .catch(() => {
        // Stops the login button from showing a loader
        setLoading(false);
      });
  }

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
              <View style={styles.loginInput}>
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
                    styles.loginTextboxInputLabelUsername,
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
                    styles.loginTextboxInputLabelPassword,
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

                <Text style={styles.loginFailedText}>{loginFailedText}</Text>
              </View>
              <View style={styles.loginButtonContainer}>
                <Button
                  title="Login"
                  type="solid"
                  titleStyle={styles.loginButtonTextStyle}
                  buttonStyle={styles.loginButtonEnabled}
                  disabledStyle={styles.loginButtonDisabled}
                  loading={loading}
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
