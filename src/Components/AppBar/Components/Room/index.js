import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { NewChat } from "../../../../Views/Chat/NewChat";
import { useNavigation } from "@react-navigation/native";
import { getUserChatLoading } from "../../../../store/entities/chat";
import { useSelector } from "react-redux";

export const AppbarRoom = (props) => {
  // Modal's visibility
  const [modalInfoVisible, setModaInfoVisible] = useState(false);
  // React Native Navigation
  const navigation = useNavigation();
  // The user's chat loading status
  const dataLoading = useSelector(getUserChatLoading);

  return (
    <View style={styles.appBarContainer}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          navigation.openDrawer();
        }}
        style={styles.navigationButton}
      >
        <Icon name="bars" type="font-awesome-5" color="white" size={28} />
        <Text style={styles.navigationButtonText}>Messages</Text>
      </TouchableOpacity>
      <View style={styles.newChat}>
        <Icon
          name="user-edit"
          type="font-awesome-5"
          color="white"
          size={25}
          /**
           * Disables the user from opening the new chat
           * component when the user's chat data is being
           * retrieved
           */
          disabled={dataLoading}
          disabledStyle={styles.iconDisabled}
          onPress={() => {
            setModaInfoVisible(true);
          }}
        />
      </View>
      <NewChat
        {...props}
        visible={modalInfoVisible}
        setVisible={setModaInfoVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationButton: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  iconDisabled: { backgroundColor: "transparent", opacity: 0.4 },
  newChat: { marginRight: 10 },
});
