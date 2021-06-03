import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { CustomModal } from "../CustomModal";
import PropTypes from "prop-types";

export const CameraPermissionsDeviceSettings = (props) => {
  return (
    <View>
      {/* Modal used for background blurring in requesting user's photo permissions */}
      <CustomModal
        content={<></>}
        coverScreen={true}
        height={100}
        visible={props.visible}
        styles={{
          backgroundColor: "black",
          opacity: props.visible ? 0.6 : 1,
        }}
      />
      {/* Modal used for requesting user's photo permissions */}
      <CustomModal
        content={
          <View>
            <View style={styles.modalTextTitleContainer}>
              <Text style={styles.modalTextTitle}>
                Please enable camera permissions for the app inside of Settings.
              </Text>
            </View>
            <View style={styles.modalContainerActions}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.modalButtonCancel, styles.modalButton]}
                onPress={() => {
                  props.setVisible(false);
                }}
              >
                <Text
                  style={[styles.modalButtonText, styles.modalButtonCancelText]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.modalButtonSettings, styles.modalButton]}
                onPress={() => {
                  Linking.openSettings();
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonSettingsText,
                  ]}
                >
                  Open Settings
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        coverScreen={true}
        roundedCorners={true}
        visible={props.visible}
        styles={styles.modalStyles}
      />
    </View>
  );
};

// Border radius style of the modal
const modalRadius = { borderTopLeftRadius: 16, borderTopRightRadius: 16 };

// The style of this component
const styles = StyleSheet.create({
  modalStyles: {
    overflow: "visible",
    ...modalRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  modalContainerActions: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 15,
  },
  modalTextTitleContainer: {
    ...modalRadius,
    backgroundColor: "#012849",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTextTitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  modalButtonText: {
    fontSize: 20,
    padding: 10,
  },
  modalButton: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtonCancel: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#014983",
  },
  modalButtonCancelText: {
    color: "#014983",
  },
  modalButtonSettings: {
    backgroundColor: "#014983",
    marginLeft: 50,
  },
  modalButtonSettingsText: {
    color: "white",
  },
});

CameraPermissionsDeviceSettings.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
