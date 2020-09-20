import React from "react";
import { TextInput } from "react-native";

/**
 * Renders the composer (aka textfield) in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const renderComposer = (props) => (
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
