import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Animated,
} from "react-native";
import SelectedImages from "./Components/SelectedImages";
import { Icon } from "react-native-elements";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Dimensions } from "react-native";

/**
 * Returns the input toolbar and passes in different handlers as props
 * @param {object} props The original props that GiftedChat created
 * @param {object} ImageHandler An Image handler that handles the user selected images
 * @param {object} ImageToViewHandler Image viewer handler that handles what image should display
 * @param {object} ActionHandler Handles the visibility of the action buttons in the input toolbar
 */
export const renderInputToolbar = (
  props,
  ImageHandler,
  ImageToViewHandler,
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
      ImageToViewHandler={ImageToViewHandler}
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
      // Determines if the actions should display
      showActions: false,
      // The keyboard's height
      keyboardHeight: 0,
      /**
       * Only used to re-render the component. The value
       * assigned doesn't change anything in this component
       */
      scrollToEnd: true,
      // Determines if the scroll view should scrolling
      allowInputScrolling: false,
    };
    this.renderActions = this.renderActions.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.inputToolbarMaxHeight = this.inputToolbarMaxHeight.bind(this);
    // Reference to the device's keyboard's height
    this.keyboardHeightRef = new Animated.Value(0);
    // Reference to the input toolbar's scrollview
    this.scrollRef = React.createRef();
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
        ImageToViewHandler={this.props.ImageToViewHandler}
        showActions={this.props.ActionHandler.showActions}
      />
    );
  };

  // When the component mounts
  componentDidMount() {
    // Sets keyboard listeners for gifted chat's text input
    Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  // When the component will unmount
  componentWillUnmount() {
    // Removes keyboard listeners for gifted chat's text input
    Keyboard.removeListener("keyboardWillShow", this.keyboardWillShow);
    Keyboard.removeListener("keyboardWillHide", this.keyboardWillHide);
  }

  // When the component updates
  componentDidUpdate(prevProps) {
    this.scrollRef.current.scrollToEnd({ animated: true });

    /**
     * If the input toolbar height changed due to the text input changing,
     * the scrollview is scrolled to it's end to always show the user's text input
     */
    // if (prevProps.text !== this.props.text) {
    //   // Checks that the reference to the scrollview exists
    //   if (this.scrollRef.current) {
    //     // Scrolls to the end of the scrollview
    //     this.scrollRef.current.scrollToEnd({ animated: true });
    //     // Sets the state in order to have the component re-render
    //     // this.setState({ scrollToEnd: !this.state.scrollToEnd });
    //   }
    // }
  }

  /**
   * Keyboard event callback for when the keyboard shows
   * @param {*} event The Keyboard event
   */
  keyboardWillShow = (event) => {
    Animated.timing(this.keyboardHeightRef, {
      duration: event.duration,
      /**
       * The value is multiplied by negative 1 so when translating
       * the text input, it will move up due to it having the position
       * 'absolute' with a bottom of '0'
       */
      toValue: -1 * event.endCoordinates.height + getBottomSpace(),
      useNativeDriver: true,
    }).start();

    // Saves the keyboard's height to the state
    this.setState({
      keyboardHeight: event.endCoordinates.height + getBottomSpace(),
    });
  };

  /**
   * Keyboard event callback for when the keyboard hides
   * @param {*} event The Keyboard event
   */
  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeightRef, {
      duration: event.duration,
      /**
       * The value is multiplied by negative 1 so when translating
       * the text input, it will move up due to it having the position
       * 'absolute' with a bottom of '0'
       */
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // Saves the keyboard's height to the state
    this.setState({
      keyboardHeight: 0,
    });
  };

  /**
   * Determines the maximum height of the input toolbar
   * @returns {number} The maximum height of the input toolbar
   */
  inputToolbarMaxHeight = () =>
    Dimensions.get("window").height -
    this.props.headerHeight -
    this.state.keyboardHeight -
    getBottomSpace();

  render() {
    console.log("Rendered");
    return (
      <Animated.View
        style={{
          // backgroundColor: "red",
          position: "absolute",
          maxHeight: this.inputToolbarMaxHeight(),
          width: "100%",
          bottom:
            0 +
            /**
             * For devices that has a bottom space, the bottom is added
             * by 11 as that's the value used to se the padding vertical in the
             * animated view. This relates to the bug in the documentation,
             * "Text_Input"
             */
            (getBottomSpace() > 0 ? 11 : 0),
          // maxHeight: Dimensions.get("window").height - this.props.headerHeight,
          transform: [{ translateY: this.keyboardHeightRef }],
        }}
      >
        <ScrollView
          ref={this.scrollRef}
          keyboardShouldPersistTaps="always"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          style={{
            // height: "100%",
            width: "100%",
            // flex: 1,
            // position: "absolute",
            // bottom: this.state.keyboardHeight,
          }}
        >
          <Animated.View
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
                // position: "absolute",
                // bottom: 0,
                // left: 0,
                // right: 0,
                // transform: [{ translateY: this.keyboardHeightRef }],
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
                activeOpacity={0.75}
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
          </Animated.View>
        </ScrollView>
      </Animated.View>
    );
  }
}

// The style of this component
const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "grey",
    backgroundColor: "yellow",
  },
  primary: {
    flexDirection: "row",
    paddingRight: "4%",
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
