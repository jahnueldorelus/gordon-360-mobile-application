import React, { useEffect, useState } from "react";
import { Modal, Button, View, TouchableWithoutFeedback } from "react-native";

export const ChatInfo = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * DO NOT REMOVE TOUCHABLE FEEDBACK. THIS FIXES A BUG WITHIN REACT NATIVE
   * SEE DOCUMENTATION FOR BUG "Modal_Closing_State_Unchanged"
   */
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
      >
        <View style={{ flex: 1 }}>
          <Button title="Close Modal" onPress={() => props.setVisible(false)} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
