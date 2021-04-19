import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

export const SignOut = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Sign Out
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Sign Out
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 15,
  },
});
