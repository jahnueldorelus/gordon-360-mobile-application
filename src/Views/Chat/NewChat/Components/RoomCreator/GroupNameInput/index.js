import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNewRoomName } from "../../../../../../store/ui/Chat/chatSelectors";
import { setNewRoomName } from "../../../../../../store/ui/Chat/chat";

export const GroupNameInput = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Room name
  const roomName = useSelector(getNewRoomName);

  // If the amount of users selected is greater than 1 (aka a group)
  if (props.selectedUsersListLength > 1)
    return (
      <SafeAreaView>
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Group Name:</Text>
          <TextInput
            placeholder="Type a name..."
            placeholderTextColor="#rgba(1, 73, 131, 0.4)"
            value={roomName}
            selectTextOnFocus={true}
            returnKeyType="done"
            onChangeText={(name) => dispatch(setNewRoomName(name.trimStart()))}
            style={styles.textInput}
          />
        </View>
      </SafeAreaView>
    );
  // Since there's only 1 selected user, creating a group name isn't allowed
  else return <></>;
};

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: "row",
    marginHorizontal: "5%",
    marginTop: 10,
    alignItems: "center",
  },
  groupTitle: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: "bold",
    color: "#014983",
  },
  textInput: {
    borderColor: "#014983",
    color: "#014983",
    fontWeight: "500",
    borderRadius: 50,
    borderWidth: 1,
    flex: 1,
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
});
