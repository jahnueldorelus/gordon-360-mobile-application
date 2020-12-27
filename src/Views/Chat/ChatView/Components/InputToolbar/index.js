import React, { Component } from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import SelectedImages from "./Components/SelectedImages";
import { Icon } from "react-native-elements";

/**
 * Returns the input toolbar and passes in different handlers as props
 * @param {Object} props The original props that GiftedChat created
 * @param {Object} ImageHandler An Image handler that handles the user selected images
 * @param {Object} ModalHandler Modal handler that handles the visibility and style of the custom modal
 * @param {Object} ActionHandler Handles the visibility of the action buttons in the input toolbar
 */
export const renderInputToolbar = (
  props,
  ImageHandler,
  ModalHandler,
  ActionHandler
) => {
  /**
   * The name of the props here is what the Composer component uses
   * to determine if GiftedChat's UI should re-render. Therefore, do not
   * change the names of these props without also changing it inside of the
   * Composer component.
   */
  return (
    <InputToolbar
      {...props}
      ImageHandler={ImageHandler}
      ModalHandler={ModalHandler}
      ActionHandler={ActionHandler}
    />
  );
};

/**
 * This component is a class instead of a functional hook. Please
 * refer to documentation bug, "InputToolbar_Class" for more info.
 */
class InputToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
    };
    this.renderActions = this.renderActions.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderImages = this.renderImages.bind(this);
  }

  // Creates the action buttons in the InputToolbar
  renderActions = () => {
    return this.props.renderActions(this.props);
  };

  // Creates the message send button in the InputToolbar
  renderSend = () => {
    return this.props.renderSend(this.props);
  };

  // Creates the textfield in the InputToolbar
  renderComposer = () => {
    return this.props.renderComposer(this.props);
  };

  // Creates the user selected images in the InputToolbar
  renderImages = () => {
    return (
      <SelectedImages
        ImageHandler={this.props.ImageHandler}
        ModalHandler={this.props.ModalHandler}
        showActions={this.props.ActionHandler.showActions}
      />
    );
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            /**
             * Do not delete the vertical padding or minimum height. This fills the gap
             * between the Input Toolbar and the keyboard that appears on the screen.
             * See documentation for bug "Text_Input"
             */
            minHeight: this.props.minInputToolbarHeight,
            paddingVertical: 11,
          },
        ]}
      >
        {/* Displays user selected images if there are any */}
        {this.renderImages()}

        {/* Displays the action buttons available */}
        {this.props.ActionHandler.showActions && this.renderActions()}

        {/* Displays the input toolbar */}
        <View style={[styles.primary]}>
          <TouchableOpacity
            onPress={() =>
              this.props.ActionHandler.setShowActions(
                !this.props.ActionHandler.showActions
              )
            }
            style={[
              {
                transform: [
                  {
                    rotate: this.props.ActionHandler.showActions
                      ? "45deg"
                      : "0deg",
                  },
                ],
              },
              ,
              styles.actionIconButton,
            ]}
          >
            <Icon
              containerStyle={styles.actionIcon}
              type="material"
              name="add"
              size={40}
              color="#5eb6fe"
            />
          </TouchableOpacity>
          <View
            style={[
              styles.composerContainer,
              {
                /**
                 * THE HEIGHT IS IMPORTANT FOR PREVENTING A TEXT INPUT BUG.
                 * SEE DOCUMENTATION FOR BUG "Text_Input"
                 */
                height:
                  Platform.OS === "android"
                    ? this.props.composerHeight + 3
                    : this.props.composerHeight + 10,
              },
            ]}
          >
            <View style={styles.composer}>{this.renderComposer()}</View>
            <View style={styles.sendButton}>{this.renderSend()}</View>
          </View>
        </View>
      </View>
    );
  }
}

// The style of this component
const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "grey",
    backgroundColor: "white",
  },
  primary: {
    flexDirection: "row",
  },
  composerContainer: {
    backgroundColor: "#EDF1F7",
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    borderRadius: 20,
    // Handles the spacing of the text field in the input tool bar
    paddingVertical: Platform.OS === "android" ? 2 : "auto",
  },
  composer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 10,
    alignSelf: "center",
  },
  sendButton: { alignSelf: "flex-end", marginBottom: 3 },
  actionIconButton: {
    alignSelf: "flex-end",
  },
  actionIcon: {
    tintColor: "#d3ebff",
    marginHorizontal: 5,
    alignSelf: "flex-end",
  },
});
