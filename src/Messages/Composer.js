import React, { useState } from "react";
import { Platform, TextInput } from "react-native";

export default function Composer(props) {
  const [composerHeight, setComposerHeight] = useState(0);
  const [text, setText] = useState("");

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
        props.onInputSizeChanged(contentSize);
        setComposerHeight(contentSize.height);
        // console.log("Change SIZE: ", contentSize.height);
      }}
      onChangeText={(text) => {
        props.onTextChanged(text);
        setText(text);
      }}
      style={{
        fontSize: 16,
        paddingTop: 0,
        borderWidth: 1,
        backgroundColor: "red",
        justifyContent: "center",
        height: props.composerHeight,
        ...Platform.select({
          web: {
            outlineWidth: 0,
            outlineColor: "transparent",
            outlineOffset: 0,
          },
        }),
      }}
      autoFocus={props.textInputAutoFocus}
      value={text}
      enablesReturnKeyAutomatically
      underlineColorAndroid="transparent"
      keyboardAppearance={props.keyboardAppearance}
      {...props.textInputProps}
    />
  );
}
