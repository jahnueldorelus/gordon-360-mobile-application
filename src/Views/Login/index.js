import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import { Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import { get } from "../../Services/HTTP/";

export const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginFailedText, setLoginFailedText] = useState(false);

  /**
   * Styles used for this component. This is created inside of the component and
   * not outside because there's a style that required the value of the component's state
   */
  const styles = StyleSheet.create({
    gradient: { flex: 1, paddingTop: 50 },
    login: {
      justifyContent: "center",
      margin: 20,
      alignContent: "center",
      marginHorizontal: 30,
    },
    loginText: {
      fontSize: 36,
      fontWeight: "bold",
      color: "white",
      marginBottom: 40,
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
      color: "rgba(255, 255, 255, 0.5)",
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
      fontSize: 22,
      textAlign: "center",
      color: "#FF5E52",
    },
    loginButton: {
      borderRadius: 30,
      maxWidth: 300,
      alignSelf: "center",
      backgroundColor: "#014983",
      marginTop: 30,
    },
    loginButtonTextStyle: {
      flex: 1,
      paddingTop: 10,
      paddingBottom: 10,
      fontWeight: "bold",
      fontSize: 25,
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
      body: `username=${username}&password=${password}&grant_type=password`,
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
            // Gets the user's profile in order to create the main user object
            let userProfile = get("profiles");
            userProfile.then(async (data) => {
              let mainUser = {
                _id: data.ID,
                name: `${data.FirstName} ${data.LastName}`,
                // TEMP IMAGE - PLEASE REPLACE
                avatar: "https://placeimg.com/140/140/any",
              };
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
      .catch((error) => {
        // Stops the login button from showing a loader
        setLoading(false);
      });
  }

  return (
    <LinearGradient colors={["#014983", "#00AEEF"]} style={styles.gradient}>
      <View style={styles.login}>
        <Text style={styles.loginText}>Login</Text>
        <Input
          leftIcon={{
            type: "material",
            name: "email",
            color: styles.loginTextIcon.color,
          }}
          placeholder="firstname.lastname"
          placeholderTextColor={styles.loginTextboxInputTextPlaceholder.color}
          onChangeText={(text) => {
            setUsername(text);
          }}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={"default"}
          keyboardType="email-address"
          returnKeyType="next"
          selectTextOnFocus
          textContentType="username"
          value={username}
          label="Gordon Email"
          containerStyle={styles.loginTextboxContainer}
          labelStyle={styles.loginTextboxInputLabel}
          inputContainerStyle={styles.loginTextboxInputContainer}
          inputStyle={styles.loginTextboxInputText}
        />

        <Input
          leftIcon={{
            type: "material",
            name: "lock",
            color: styles.loginTextIcon.color,
          }}
          placeholder="Password"
          placeholderTextColor={styles.loginTextboxInputTextPlaceholder.color}
          onChangeText={(text) => {
            setPassword(text);
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
          label="Password"
          containerStyle={styles.loginTextboxContainer}
          labelStyle={styles.loginTextboxInputLabel}
          inputContainerStyle={styles.loginTextboxInputContainer}
          inputStyle={styles.loginTextboxInputText}
        />

        <Text style={styles.loginFailedText}>{loginFailedText}</Text>

        <Button
          title="Login"
          type="solid"
          titleStyle={styles.loginButtonTextStyle}
          buttonStyle={styles.loginButton}
          loading={loading}
          onPress={getAuthorized}
        />
      </View>
    </LinearGradient>
  );
};
