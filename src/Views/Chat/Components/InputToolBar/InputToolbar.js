import React, { useState, useEffect } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import Composer from "./Components/Composer";
import Send from "./Components/Send";
import Actions from "./Components/Actions";

const InputToolbar = (props) => {
  const [position, setPosition] = useState("absolute");

  useEffect(() => {
    /**
     * An event listener for keyboard is added so that the input toolbar will
     * be pushed up instead of covered by a device's keyboard
     */
    Keyboard.addListener("keyboardWillShow", () => {
      if (position !== "relative") {
        setPosition("relative");
      }
    });
    Keyboard.addListener("keyboardWillHide", () => {
      if (position !== "absolute") {
        setPosition("absolute");
      }
    });

    // The keyboard event listeners are removed after it's no longer needed
    return () => {
      Keyboard.removeListener("keyboardWillShow", () => {});
      Keyboard.removeListener("keyboardWillHide", () => {});
    };
  }, []);

  const renderActions = () => {
    if (props.renderActions) {
      return props.renderActions(props);
    } else if (props.onPressActionButton) {
      return <Actions {...props} />;
    }
    return null;
  };

  const renderSend = () => {
    if (props.renderSend) {
      return props.renderSend(props);
    }
    return <Send {...props} />;
  };

  const renderComposer = () => {
    if (props.renderComposer) {
      return props.renderComposer(props);
    }
    return <Composer {...props} />;
  };

  const renderAccessory = () => {
    if (props.renderAccessory) {
      return (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {props.renderAccessory(props)}
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        {
          position,
          justifyContent: "center",
          /**
           * Do not delete the vertical padding or minimum height. This fills the gap
           * between the Input Toolbar and the keyboard that appears on the screen.
           * See documentation for bug "iOS_Text_Input"
           */
          minHeight: props.minInputToolbarHeight,
          paddingVertical: 11,
        },
      ]}
    >
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions()}
        {/**
         * With a custom Composer, the Composer and Send button are rendered
         * in the same view instead of seperate (side by side)
         */}
        {props.renderComposer && (
          <View
            style={{
              /**
               * THESE STYLES ARE IMPORTANT FOR PREVENTING TEXT INPUT BUG ON IOS.
               * SEE DOCUMENTATION FOR BUG "iOS_Text_Input"
               */
              backgroundColor: "#EDF1F7",
              flex: 1,
              marginRight: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 20,
              height: props.composerHeight + 10,
            }}
          >
            <View
              style={{
                /**
                 * THESE STYLES ARE IMPORTANT FOR PREVENTING TEXT INPUT BUG ON IOS.
                 * SEE DOCUMENTATION FOR BUG "iOS_Text_Input"
                 */
                flex: 1,
                justifyContent: "flex-end",
                paddingHorizontal: 15,
              }}
            >
              {renderComposer()}
            </View>
            <View>{renderSend()}</View>
          </View>
        )}
        {/* If a custom composer is not present, the original composer and sent components are returned */}
        {!props.renderComposer && renderComposer()}
        {!props.renderComposer && renderSend()}
      </View>
      {renderAccessory()}
    </View>
  );
};

export const renderInputToolbar = (props) => <InputToolbar {...props} />;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "grey",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  accessory: {
    height: 44,
  },
});
