import React from "react";
import { View } from "react-native";
import { CustomModal } from "../../../../../../Components/CustomModal";

export const CameraPermissions = (props) => {
  return (
    <View>
      {/* Modal used for background blurring in requesting user's photo permissions */}
      <CustomModal
        content={<></>}
        coverScreen={true}
        height={100}
        visible={props.modalConfig.visible}
        styles={{
          backgroundColor: "black",
          opacity: props.modalConfig.visible ? 0.6 : 1,
        }}
      />
      {/* Modal used for requesting user's photo permissions */}
      <CustomModal
        content={props.modalConfig.content}
        coverScreen={true}
        roundedCorners={true}
        visible={props.modalConfig.visible}
        styles={props.modalConfig.styles}
      />
    </View>
  );
};
