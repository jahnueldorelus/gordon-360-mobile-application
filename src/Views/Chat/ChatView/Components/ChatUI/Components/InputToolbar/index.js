import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Composer } from "./Components/Composer";
import { ComposerSend } from "./Components/ComposerSend";
import { Actions } from "./Components/Actions";
import SelectedImages from "./Components/SelectedImages";
import { Icon } from "react-native-elements";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getTextInputContentSize,
  getInitialInputContentHeight,
} from "../../../../../../../store/ui/Chat/chatSelectors";
import { setInitialInputContentHeight } from "../../../../../../../store/ui/Chat/chat";
import {
  getDeviceOrientation,
  getKeyboardHeight,
  setKeyboardHeight,
  getAppbarHeight,
} from "../../../../../../../store/ui/app";

/**
 * Returns the input toolbar and passes in different handlers as props
 * @param {object} props The original props that GiftedChat created
 * @param {object} ImageHandler An Image handler that handles the user selected images
 * @param {object} ImageToViewHandler Image viewer handler that handles what image should display
 * @param {object} ActionHandler Handles the visibility of the action buttons in the input toolbar
 * @param {object} CameraPermissionsHandler Modal handler that handles the visibility of the camera permissions
 */
export const renderInputToolbar = (
  props,
  ImageHandler,
  ImageToViewHandler,
  ActionHandler,
  CameraPermissionsHandler
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
      CameraPermissionsHandler={CameraPermissionsHandler}
    />
  );
};

const InputToolbar = (props) => {
  // Redux dispatch
  const dispatch = useDispatch();
  // Text input content size
  const inputContentSize = useSelector(getTextInputContentSize);
  // Text input initial size
  const initialInputContentHeight = useSelector(getInitialInputContentHeight);
  // The height of the input toolbar
  const [inputToolbarHeight, setinputToolbarHeight] = useState(66);
  // The maximum height of the input toolbar
  const [inputToolbarMaxHeight, setInputToolbarMaxHeight] = useState(0);
  // The keyboard's height
  const keyboardHeight = useSelector(getKeyboardHeight);
  // Reference to the input toolbar's scrollview
  const scrollRef = useRef(null);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);
  // The appbar's height
  let appbarHeight = useSelector(getAppbarHeight);
  /**
   * Replaces the appbar height from the state with height received from
   * props if available
   */
  if (typeof props.appbarHeight === "number") appbarHeight = props.appbarHeight;
  // The spacing height of the user's selected images
  const selectedImagesHeight = 161;

  /**
   * Sets the maximum input toolbar height
   */
  useEffect(() => {
    // The maximum space available for the input toolbar
    const spaceAvailable =
      Dimensions.get("window").height -
      appbarHeight -
      keyboardHeight +
      getBottomSpace();

    // Half the height of the device (depends on device orientation)
    const halfOfDeviceHeight = Dimensions.get("window").height / 2;

    /**
     * Calculates the maximum input height. If the keyboard is visible,
     * the maximum input toolbar height is the space available for the input
     * toolbar. Otherwise, the input toolbar can only have a maximum height of
     * half of the device's height (allow the user to see their messages).
     * However, if the input toolbar is allowed to take the full space available,
     * it will instead of half of the device's height in order to
     */
    const maxInputHeight =
      keyboardHeight > 0 || props.fullMaxHeight
        ? spaceAvailable
        : halfOfDeviceHeight;

    // Sets the new input toolbar's maximum height
    setInputToolbarMaxHeight(maxInputHeight);
  }, [screenOrientation, keyboardHeight, appbarHeight]);

  /**
   * Sets the initial text input content height
   */
  useEffect(() => {
    /**
     * A check is made for both the height and width of the input
     * content size. Due to the text input rendering many times,
     * the true initial content height is available upon the first
     * instance where both the height and width are available
     */
    if (
      inputContentSize &&
      inputContentSize.height &&
      inputContentSize.width &&
      !initialInputContentHeight
    ) {
      dispatch(setInitialInputContentHeight(inputContentSize.height));
    }
  }, [inputContentSize]);

  /**
   * Whenever the content size of the input or the device orientation
   * changes, the scrollview is scrolled all the way to the bottom
   * to always have the text input visible on the screen.
   */
  useEffect(() => {
    scrollRef.current.scrollToEnd();
  }, [screenOrientation, inputContentSize, keyboardHeight, appbarHeight]);

  /**
   * Keyboard Listeners
   */
  useEffect(() => {
    // Sets keyboard listeners for gifted chat's text input
    if (Platform.OS === "ios") {
      Keyboard.addListener("keyboardWillShow", keyboardWillAndDidShow);
      Keyboard.addListener("keyboardWillHide", keyboardWillAndDidHide);
    } else if (Platform.OS === "android") {
      Keyboard.addListener("keyboardDidShow", keyboardWillAndDidShow);
      Keyboard.addListener("keyboardDidHide", keyboardWillAndDidHide);
    }

    // Removes keyboard listeners for gifted chat's text input
    return () => {
      if (Platform.OS === "ios") {
        Keyboard.removeListener("keyboardWillShow", keyboardWillAndDidShow);
        Keyboard.removeListener("keyboardWillHide", keyboardWillAndDidHide);
      } else if (Platform.OS === "android") {
        Keyboard.removeListener("keyboardDidShow", keyboardWillAndDidShow);
        Keyboard.removeListener("keyboardDidHide", keyboardWillAndDidHide);
      }
    };
  }, []);

  /**
   * Whenever the screen orientation, input content size, or the amount of
   * selected images changes or the actions button is toggled, the minimum
   * input toolbar height is recalculated
   */
  useEffect(() => {
    setinputToolbarHeight(getInputToolbarHeight());
  }, [
    screenOrientation,
    inputContentSize,
    props.ImageHandler.selectedImages,
    props.ActionHandler.showActions,
  ]);

  /**
   * Whenever the the amount of selected images changes or the
   * actions button is toggled to be visible, the input toolbar
   * is scrolled to the top
   */
  useEffect(() => {
    scrollRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }, [props.ImageHandler.selectedImages, props.ActionHandler.showActions]);

  /**
   * Keyboard event callback for when the keyboard shows
   * @param {*} event The Keyboard event
   */
  const keyboardWillAndDidShow = (event) => {
    // Saves the keyboard's height to redux's state
    dispatch(setKeyboardHeight(event.endCoordinates.height + getBottomSpace()));
  };

  /**
   * Keyboard event callback for when the keyboard hides
   * @param {*} event The Keyboard event
   */
  const keyboardWillAndDidHide = (event) => {
    // Saves the keyboard's height to redux's state
    dispatch(setKeyboardHeight(0));
  };

  /**
   * Configures the height of the input toolbar.
   * Do not delete or change the values below unless you change its
   * corresponding values in its respective components.
   */
  const getInputToolbarHeight = () => {
    /**
     * Minimum height is 66. This height is required for the input toolbar to display
     * correctly without a spacing bug between the input toolbar and keyboard
     */
    let height = 66;

    /**
     * If there are selected images, an added spacing of 161 is required to
     * display the images without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 161 because each image has a height of 150 including
     * 11 for spacing.
     */
    if (props.ImageHandler.selectedImages.length > 0)
      height += selectedImagesHeight;

    /**
     * If the action buttons will be displayed, an added spacing of 45 is required to
     * display the buttons without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 45 because each button has a height of 40 including 5
     * for spacing
     */
    if (props.ActionHandler.showActions) height += 45;

    // Adds the content size of the text input if available
    if (props.text && inputContentSize && initialInputContentHeight) {
      if (inputContentSize.height > initialInputContentHeight * 2)
        height +=
          inputContentSize.height -
          // Removes extra spacing that different between Android and iOS
          (Platform.OS === "ios"
            ? 2 * initialInputContentHeight
            : initialInputContentHeight);
    }
    return height;
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height:
          keyboardHeight > 0
            ? inputToolbarHeight
            : inputToolbarHeight + getBottomSpace(),
        marginBottom:
          Platform.OS === "ios"
            ? /**
               * iOS devices require for the input toolbar to be pushed up
               * or else the keyboard will cover over it when it's visible
               */
              keyboardHeight > 0
              ? keyboardHeight - getBottomSpace()
              : 0
            : // Android automatically pushes up the text input so not margin is needed
              0,
        maxHeight: inputToolbarMaxHeight,
      }}
    >
      <ScrollView
        /**
         * Scroll indicator prevents glitch with scrollbar appearing
         * in the middle of the screen
         */
        scrollIndicatorInsets={{ right: 1 }}
        ref={scrollRef}
        keyboardShouldPersistTaps="always"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        style={{
          flex: 1,
          maxHeight: Math.min(
            inputToolbarHeight + getBottomSpace(),
            inputToolbarMaxHeight
          ),
        }}
        contentContainerStyle={{
          justifyContent: "flex-end",
          paddingBottom:
            keyboardHeight === 0 && props.addToolbarBottomPadding
              ? getBottomSpace()
              : 0,
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              paddingVertical: 11,
            }}
          >
            {/* Displays user selected images if there are any */}
            <SelectedImages
              ImageHandler={props.ImageHandler}
              ImageToViewHandler={props.ImageToViewHandler}
              showActions={props.ActionHandler.showActions}
            />

            {/* Displays the action buttons available */}
            {props.ActionHandler.showActions && (
              <Actions
                ImageHandler={props.ImageHandler}
                CameraPermissionsHandler={props.CameraPermissionsHandler}
              />
            )}

            {/* Displays the input toolbar */}
            <View style={[styles.primary]}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  props.ActionHandler.setShowActions(
                    !props.ActionHandler.showActions
                  )
                }
                style={[
                  {
                    transform: [
                      {
                        rotate: props.ActionHandler.showActions
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
              <View style={styles.composerContainer}>
                {/* Creates the textfield in the InputToolbar */}
                <View style={styles.composer}>
                  <Composer
                    {...props}
                    inputToolbarMaxHeight={inputToolbarMaxHeight}
                    composerScrollRef={scrollRef}
                    giftedChatRef={props.giftedChatRef}
                  />
                </View>
                {/* Creates the message send button in the InputToolbar */}
                <View style={styles.sendButton}>
                  <ComposerSend {...props} />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

// The style of this component
const styles = StyleSheet.create({
  primary: {
    flexDirection: "row",
    paddingRight: "2%",
    alignContent: "center",
    justifyContent: "center",
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
    alignSelf: "center",
  },
  sendButton: {
    alignSelf: "flex-end",
  },
  actionIconButton: {
    alignSelf: "flex-end",
  },
  actionIcon: {
    tintColor: "#d3ebff",
    marginHorizontal: 5,
    alignSelf: "flex-end",
  },
});
