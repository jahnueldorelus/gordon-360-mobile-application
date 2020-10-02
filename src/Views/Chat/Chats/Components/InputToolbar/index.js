import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Composer from "./Components/Composer";
import Send from "./Components/Send";
import Actions from "./Components/Actions";

/**
 * THIS COMPONENT IS A CLASS INSTEAD OF A CUSTOM HOOK DUE TO AN BUG
 * When this component is a hook, there's a bug where the input toolbar would
 * be visible but the moment the keyboard will show, it would cover over it.
 * However, this issue doesn't occur when the component is a class. Not sure what's
 * the reason for this is, but it's best to leave this component as a class to prevent
 * the bug and a memory leak issue.
 */
class InputToolbar extends Component {
  contructor(props) {
    this.renderAccessory = this.renderAccessory.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
  }

  renderActions = () => {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  };

  renderSend = () => {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props} />;
  };

  renderComposer = () => {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }
    return <Composer {...this.props} />;
  };

  renderAccessory = () => {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            // position: this.state.position,
            justifyContent: "center",
            /**
             * Do not delete the vertical padding or minimum height. This fills the gap
             * between the Input Toolbar and the keyboard that appears on the screen.
             * See documentation for bug "iOS_Text_Input"
             */
            minHeight: this.props.minInputToolbarHeight,
            paddingVertical: 11,
          },
        ]}
      >
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {/**
           * With a custom Composer, the Composer and Send button are rendered
           * in the same view instead of seperate (side by side)
           */}
          {this.props.renderComposer && (
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
                height: this.props.composerHeight + 10,
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
                {this.renderComposer()}
              </View>
              <View>{this.renderSend()}</View>
            </View>
          )}
          {/* If a custom composer is not present, the original composer and sent components are returned */}
          {!this.props.renderComposer && this.renderComposer()}
          {!this.props.renderComposer && this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }
}

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
