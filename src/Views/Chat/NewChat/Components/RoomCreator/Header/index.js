import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { setRoomImage, setRoomName } from "../../../../../../store/ui/chat";

export const Header = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#014983", "#015483"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => {
            // Deletes the room image if existent
            dispatch(setRoomImage(null));
            // Deletes the room name if existent
            dispatch(setRoomName(""));
            // Closes this modal
            props.setVisible(false);
          }}
          style={styles.button}
        >
          <View style={styles.buttonContainer}>
            <Icon
              name={"chevron-left"}
              type="font-awesome-5"
              color="white"
              size={22}
              containerStyle={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>People Search</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { backgroundColor: "blue" },
  mainContainer: {
    alignSelf: "center",
    width: "90%",
    paddingVertical: 5,
  },
  button: {
    alignSelf: "flex-start",
    paddingRight: 5,
  },
  buttonContainer: { flexDirection: "row" },
  buttonIcon: {
    padding: 5,
    marginRight: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
});
