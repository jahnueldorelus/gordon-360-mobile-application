import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

/**
 * Renders the composer (aka textfield) in the InputToolbar. Also handles,
 * the size of the InputToolbar, by getting GiftedChat to re-render the UI.
 * This is used to properly show images/videos when they are added to
 * the InputToolbar.
 * @param {JSON} props Props passed from parent
 */
export const renderComposer = (props) => {
  return <Composer {...props} />;
};

const Composer = (props) => {
  const [inputSize, setInputSize] = useState(null);
  const imageSet = useRef(false);

  /**
   * Properly displays any selected images and videos
   */
  useEffect(() => {
    /**
     * If there are selected images/videos and the proper measurements by GiftedChat has
     * not already been set,then GiftedChat's InputSizeChanged method is called to make it re-render
     * the UI to display the selected images/videos correctly
     */
    if (props.images && !imageSet.current && inputSize) {
      imageSet.current = true;
      props.onInputSizeChanged(inputSize);
    }
    // If there are no selected imagess or videos, everything is reset
    else if (!props.images) {
      imageSet.current = false;
    }
  }, [props.images]);

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
        // Sets the input size so that it's always availble
        // to be used when re-rendering the InputToolbar
        setInputSize(contentSize);
        contentSize.height = Math.ceil(contentSize.height);
        props.onInputSizeChanged(contentSize);
      }}
      onChangeText={(text) => {
        props.onTextChanged(text);
      }}
      style={{
        fontSize: 16,
        paddingTop: 0,
        justifyContent: "flex-end",
      }}
      autoFocus={props.textInputAutoFocus}
      enablesReturnKeyAutomatically
      underlineColorAndroid="transparent"
      keyboardAppearance={props.keyboardAppearance}
      {...props.textInputProps}
    />
  );
};
