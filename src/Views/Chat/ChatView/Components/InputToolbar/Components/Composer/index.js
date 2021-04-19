import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { TextInput, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { getUseHapticsForTexting } from "../../../../../../../store/entities/Settings/settingsSelectors";
import { useSelector } from "react-redux";

/**
 * Renders the composer (aka textfield) in the InputToolbar. Also handles,
 * the size of the InputToolbar, by getting GiftedChat to re-render the UI.
 *  See documentation bug warning, "GiftedChat_InputToolbar_Rerender"
 * @param {JSON} props Props passed from parent
 */
export const renderComposer = (props) => {
  return <Composer {...props} />;
};

const Composer = (props) => {
  // The content size of the textfield in the InputToolbar
  const [inputSize, setInputSize] = useState(null);
  /**
   * Used to determine if GiftedChat has already re-rendered itself to
   * create spacing for images and videos in the InputToolbar
   */
  const giftedChatInputHeightSet = useRef(false);
  // Used to determine if the actions buttons visibility changed
  const actionsVisible = useRef(props.ActionHandler.showActions);
  // Determines if haptics are enabled
  const hapticsEnabled = useSelector(getUseHapticsForTexting);

  /**
   * Properly displays any selected images and videos in the InputToolbar.
   * A check is done to see if there any images
   */
  useEffect(() => {
    // The list of user selected image(s)
    let images = JSON.parse(props.ImageHandler.selectedImages);

    /**
     * If there are selected images and the proper measurements by GiftedChat has not
     * already been set, then GiftedChat's InputSizeChanged method is called to make
     * it re-render the UI to display the selected images/videos correctly
     */
    if (
      images &&
      images.length > 0 &&
      !giftedChatInputHeightSet.current &&
      inputSize
    ) {
      giftedChatInputHeightSet.current = true;
      props.onInputSizeChanged(inputSize); // Doesn't change anything but causes GiftedChat to re-render
    } else if (
      images &&
      images.length === 0 &&
      giftedChatInputHeightSet.current
    ) {
      /**
       * If there are no selected images or videos, everything is reset and GiftedChat is
       * re-rendered to remove the space that was allocated to display the user's selected
       * images
       */
      giftedChatInputHeightSet.current = false;
      props.onInputSizeChanged(inputSize); // Doesn't change anything but causes GiftedChat to re-render
    }

    // If the visibility of the action buttons change
    if (actionsVisible.current !== props.ActionHandler.showActions) {
      actionsVisible.current = props.ActionHandler.showActions;
      props.onInputSizeChanged(inputSize); // Doesn't change anything but causes GiftedChat to re-render
    }
  }, [props.ImageHandler.selectedImages, props.ActionHandler.showActions]);

  return (
    <TextInput
      testID={props.placeholder}
      accessible
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor}
      multiline
      editable={!props.disableComposer}
      onContentSizeChange={(e) => {
        const { contentSize } = e.nativeEvent;
        contentSize.height = Math.ceil(contentSize.height);
        contentSize.width = Math.ceil(contentSize.width);
        /**
         * Sets the input size of the text input so that it may be used
         * in the useEffect() above and for GiftedChat to re-render
         * and correctly measure the height of the InputToolBar.
         */
        setInputSize(contentSize);

        props.onInputSizeChanged(contentSize);
      }}
      onChangeText={(text) => {
        props.onTextChanged(text);
        // Does Haptic feedback if enabled
        if (hapticsEnabled) Haptics.selectionAsync();
      }}
      style={styles.input}
      autoFocus={props.textInputAutoFocus}
      enablesReturnKeyAutomatically
      underlineColorAndroid="transparent"
      keyboardAppearance={props.keyboardAppearance}
      {...props.textInputProps}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    /**
     * Font size for each platform is in respect to each platform's
     * default font-size
     */
    fontSize: Platform.OS === "android" ? 16 : 17,
    // Padding top is removed. See documentation bug, "iOS_Text_Input"
    paddingTop: 0,
    justifyContent: "flex-end",
  },
});
