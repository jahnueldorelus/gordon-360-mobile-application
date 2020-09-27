import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Avatar, Accessory } from "react-native-elements";
import { getChatName } from "../../../Services/Messages/MessageService";
import AsyncStorage from "@react-native-community/async-storage";

export const AppbarChat = (props) => {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);

  /**
   * Sets the room from the prop given
   */
  useEffect(() => {
    setRoom(props.route.params.roomProp);
  }, []);

  /**
   * Gets the main user
   */
  useEffect(() => {
    async function getUser() {
      setUser(JSON.parse(await AsyncStorage.getItem("user")));
    }

    getUser();
  }, []);

  if (room && user)
    return (
      <View style={styles.appBarContainer}>
        <View style={styles.navigationButton}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.pop();
              props.navigation.navigate("Rooms");
            }}
          >
            <Image
              style={styles.navigationButtonImage}
              source={require("./Images/back_button.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.options}>
          <Avatar
            size="small"
            rounded
            overlayContainerStyle={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "white",
            }}
            source={{
              uri: room.roomImage,
            }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <Text style={styles.text} numberOfLines={1}>
            {getChatName(room, user)}
          </Text>
        </View>
      </View>
    );
  else return <></>;
};

// Gets the width of the device
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  navigationButton: { marginHorizontal: 10 },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  options: {
    flex: 1,
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: { paddingLeft: 10 },
  text: {
    paddingLeft: 10,
    maxWidth: Math.max(deviceWidth / 2, 300),
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});