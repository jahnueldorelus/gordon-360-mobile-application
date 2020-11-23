import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Avatar, Accessory } from "react-native-elements";
import { getChatName, getMainUser } from "../../../../Services/Messages";
import { Icon } from "react-native-elements";
import { ChatInfo } from "../../../../Views/Chat/ChatInfo/index";

export const AppbarChat = (props) => {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [modalInfoVisible, setModaInfoVisible] = useState(false);

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
      await getMainUser().then((data) => {
        setUser(data);
      });
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
              source={require("../Images/back_button.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.chatName}>
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
        <View style={styles.options}>
          <Icon
            name="info"
            type="material"
            color="white"
            size={30}
            onPress={() => {
              modalInfoVisible
                ? setModaInfoVisible(false)
                : setModaInfoVisible(true);
            }}
          />
        </View>
        <ChatInfo
          {...props}
          visible={modalInfoVisible}
          setVisible={setModaInfoVisible}
        />
      </View>
    );
  else return <></>;
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButton: { marginHorizontal: 10 },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  chatName: {
    flex: 1,
    alignItems: "center",
  },
  avatar: { paddingLeft: 10 },
  text: {
    paddingTop: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  options: {
    marginHorizontal: 10,
  },
});
