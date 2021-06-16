import React, { useEffect, useRef } from "react";
import { Platform, TextInput, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { getUseHapticsForTexting } from "../../../../../../../../../store/entities/Settings/settingsSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setTextInputContentSize } from "../../../../../../../../../store/ui/Chat/chat";
import { getTextInputContentSize } from "../../../../../../../../../store/ui/Chat/chatSelectors";

/**
 * Renders the composer (aka textfield) in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const Composer = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The content size of the textfield in the InputToolbar
  const inputSize = useSelector(getTextInputContentSize);
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
    let images = props.ImageHandler.selectedImages;

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
      dispatch(setTextInputContentSize(inputSize));
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
      dispatch(setTextInputContentSize(inputSize));
    }

    // If the visibility of the action buttons change
    if (actionsVisible.current !== props.ActionHandler.showActions) {
      actionsVisible.current = props.ActionHandler.showActions;
      dispatch(setTextInputContentSize(inputSize));
    }
  }, [props.ImageHandler.selectedImages, props.ActionHandler.showActions]);

  return (
    <TextInput
      accessible
      placeholder={"Type a message..."}
      multiline
      value={props.text}
      onFocus={() => {
        /**
         * Once the text input is focused, the parent scrollview is
         * scrolled to the end to show the focused text input
         */
        props.composerScrollRef.current.scrollToEnd();
        // Scrolls to the bottom of the user's messages
        props.giftedChatRef.current.scrollToBottom();
      }}
      onContentSizeChange={(e) => {
        const { height, width } = e.nativeEvent.contentSize;
        // The new content size
        const newContentSize = {
          height: Math.ceil(height),
          width: Math.ceil(width),
        };

        // Saves the content size to redux's state
        dispatch(setTextInputContentSize(newContentSize));
      }}
      onChangeText={(text) => {
        props.onTextChanged(text);
        // Does Haptic feedback if enabled
        if (hapticsEnabled) Haptics.impactAsync();
        /**
         * Once the text input changes, the parent scrollview is
         * scrolled to the end to show the focused text input
         */
        props.composerScrollRef.current.scrollToEnd({ animate: true });
      }}
      style={[
        styles.input,
        // Sets the maximum height of the composer
        { maxHeight: props.inputToolbarMaxHeight - 22 },
      ]}
      enablesReturnKeyAutomatically
      underlineColorAndroid="transparent"
      keyboardAppearance="default"
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
    justifyContent: "flex-end",
  },
});
