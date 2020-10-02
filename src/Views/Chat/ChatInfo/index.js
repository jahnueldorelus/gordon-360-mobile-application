import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  getMainUser,
  getMessages,
  getImages,
} from "../../../Services/Messages/MessageService";
import { Icon, Avatar } from "react-native-elements";

export const ChatInfo = (props) => {
  const [messages, setMessages] = useState(null);
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [mainUser, setMainUser] = useState([null]);
  const [room, setRoom] = useState(null);

  /**
   * Gets the list of messages for the chat. The main user, the room, and
   * all users in the room are retrieved.
   */
  useEffect(() => {
    async function setUserData() {
      await getMainUser().then((currentUser) => {
        // Gets the main user
        setMainUser(currentUser);
        // Gets the list of users excluding the main user
        setUsers(
          props.route.params.roomProp.users.filter(
            (user) => user._id !== currentUser._id
          )
        );
      });
    }
    setUserData();

    // Sets the messages of the chat
    setMessages(getMessages(props.route.params.roomProp._id)[0].messages);
    // Sets the room info
    setRoom(props.route.params.roomProp);
    // getImages(props.route.params.roomProp._id);
  }, []);

  /**
   * DO NOT REMOVE TOUCHABLE FEEDBACK. ALSO, DON'T USE THE COMPONENT BUTTON
   * IN THIS MODAL. USE TOUCHABLEOPACITY INSTEAD. THIS FIXES A BUG WITHIN REACT NATIVE.
   * SEE DOCUMENTATION FOR BUG "Modal_Closing_State_Unchanged"
   */
  if (messages && users && mainUser && room) {
    return (
      <Modal
        visible={props.visible}
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => props.setVisible(false)}
        onDismiss={() => props.setVisible(false)}
      >
        <TouchableWithoutFeedback
          onPressOut={(e) => {
            if (e.nativeEvent.locationY < 0) {
              props.setVisible(false);
            }
          }}
          style={styles.touchableWithout}
        >
          <View style={styles.touchableWithout}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Chat Details</Text>
              <TouchableOpacity
                title="Close Modal"
                onPress={() => props.setVisible(false)}
              >
                <Icon name="close" type="material" color="#002F64" size={30} />
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                <View
                  style={{
                    marginHorizontal: 30,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#3C6AA8",
                      fontSize: 20,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    Users
                  </Text>
                  {users.map((user, index) => {
                    return (
                      <View
                        key={user.name}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#3C6AA8",
                          paddingHorizontal: 20,

                          borderRadius: 10,
                          paddingVertical: 5,
                          borderWidth: 1,
                          marginTop: index === 0 ? 0 : 10,
                        }}
                      >
                        <Avatar
                          rounded
                          source={{
                            uri: user.avatar,
                          }}
                        />
                        <Text
                          style={{
                            marginLeft: 20,
                            fontSize: 18,
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          {user.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  } else return <></>;
};

const styles = StyleSheet.create({
  touchableWithout: { flex: 1 },
  title: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    width: "80%",
    marginVertical: 20,
  },
  titleText: {
    color: "#002F64",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
});
