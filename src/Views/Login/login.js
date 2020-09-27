import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import { Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * TEMPORARY
   * Saves the main user to local storage
   */
  useEffect(() => {
    async function saveUser() {
      try {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            _id: 5,
            name: "Aaron",
            avatar: "https://placeimg.com/140/140/any",
          })
        );
      } catch (e) {}
    }

    saveUser();
  }, []);

  /**
   * Gets the token from the back-end
   */
  async function getAuthorized() {
    setLoading(true);
    // Fetch request made to get token
    // const axios = require("axios");
    // axios
    //   .post("https://360apitrain.gordon.edu/api/token", {
    //     username: username,
    //     password: password,
    //     grant_type: "password",
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    // Temporary: Just to show the Login button loading
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  return (
    <LinearGradient
      // Button Linear Gradient
      colors={["#014983", "#00AEEF"]}
      style={styles.gradient}
    >
      <View style={styles.login}>
        <Text style={styles.loginText}>Login</Text>
        <Input
          leftIcon={{
            type: "material",
            name: "email",
            color: styles.loginTextIcon.color,
          }}
          placeholder="firstname.lastname@gordon.edu"
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
