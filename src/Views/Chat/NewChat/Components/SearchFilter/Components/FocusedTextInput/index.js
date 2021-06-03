import React, { useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Animated,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  getSelectedFilterName,
  setSelectedFilterSectionItem,
} from "../../../../../../../store/ui/peopleSearchFilter";
import { useDispatch, useSelector } from "react-redux";

export const FocusedTextInput = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The selected filter's name
  const filterName = useSelector(getSelectedFilterName);

  // Reference to the device's keyboard's height
  const keyboardHeightRef = useRef(new Animated.Value(0));

  // Focused Text Input Ref
  const focusedTextInputRef = useRef(null);

  useEffect(() => {
    /**
     * Focuses on the text input if there's a focused text input
     * If there's a text input that was selected, it's input will be focused
     * This will make the keyboard appear automatically for the user to give input
     */
    if (JSON.stringify(props.focusedTextInput) !== JSON.stringify({})) {
      TextInput.State.focusTextInput(focusedTextInputRef.current);
    }

    /**
     * If the modal isn't visible, the focused text input's data and its reference
     * are reset.
     */
    if (!props.visible) {
      // Resets the modal so that if there's a focused text input, it's dismissed
      props.setFocusedTextInput({});
      focusedTextInputRef.current = null;
    }
  }, [props.focusedTextInput, focusedTextInputRef.current, props.visible]);

  /**
   * Keyboard Listeners for the focused text input
   */
  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", keyboardWillShow);
    return () => Keyboard.removeListener("keyboardWillShow", keyboardWillShow);
  }, []);

  /**
   * Keyboard event callback for when the keyboard shows
   * @param {*} event The Keyboard event
   */
  const keyboardWillShow = (event) => {
    Animated.timing(keyboardHeightRef.current, {
      duration: event.duration,
      /**
       * The value is multiplied by negative 1 so when translating
       * the text input, it will move up due to it having the position
       * 'absolute' with a bottom of '0'
       */
      toValue: -1 * event.endCoordinates.height,
      useNativeDriver: true,
    }).start();
  };

  // If the filter modal is visible
  if (props.visible)
    return (
      <Animated.View
        style={[
          styles.filterContentContainerInput,
          {
            transform: [{ translateY: keyboardHeightRef.current }],
          },
        ]}
      >
        <SafeAreaView style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name={
              props.focusedTextInput.sectionIcon
                ? props.focusedTextInput.sectionIcon
                : "clipboard"
            }
            type="font-awesome-5"
            color="#224d85"
            size={20}
          />
          <Text style={styles.filterContentSectionTitle}>
            {props.focusedTextInput.sectionName}:
          </Text>
          <TextInput
            ref={focusedTextInputRef}
            selectTextOnFocus
            returnKeyType="done"
            style={styles.filterContentSectionSelectedItemInput}
            value={props.focusedTextInput.selected}
            onSubmitEditing={({ nativeEvent }) => {
              /**
               * Saves the text so that the input could be reset first.
               * This is for UI purposes so that the text input disappears
               * quicker.
               */
              const text = nativeEvent.text;

              // Resets the focused input text reference and data
              props.setFocusedTextInput({});
              focusedTextInputRef.current = null;

              dispatch(
                setSelectedFilterSectionItem(
                  filterName,
                  props.focusedTextInput.sectionName,
                  text ? text : ""
                )
              );
            }}
            onChangeText={(text) => {
              props.setFocusedTextInput({
                ...props.focusedTextInput,
                selected: text,
              });
            }}
          />
          <Icon
            disabled={!props.focusedTextInput.selected}
            name={"eraser"}
            type="font-awesome-5"
            color="#224d85"
            size={22}
            onPress={() =>
              props.setFocusedTextInput({
                ...props.focusedTextInput,
                selected: "",
              })
            }
            containerStyle={styles.filterContentSectionActionsRemoveInput}
            disabledStyle={
              styles.filterContentSectionActionsRemoveInputDisabled
            }
          />
          <Icon
            name={"times"}
            type="font-awesome-5"
            color="#224d85"
            size={22}
            onPress={() => {
              props.setFocusedTextInput({});
              focusedTextInputRef.current = null;
            }}
            containerStyle={styles.filterContentSectionActionsDismissInput}
          />
        </SafeAreaView>
      </Animated.View>
    );
  // If the filter modal isn't visible
  else return <></>;
};

const styles = StyleSheet.create({
  filterContentContainerInput: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#5072ba",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  filterContentSectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#224d85",
  },
  filterContentSectionSelectedItemInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#5072ba",
    paddingVertical: 13,
  },
  filterContentSectionActionsRemoveInput: {
    marginLeft: 15,
    padding: 5,
  },
  filterContentSectionActionsRemoveInputDisabled: {
    backgroundColor: "transparent",
    opacity: 0.2,
  },
  filterContentSectionActionsDismissInput: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingRight: 5,
    paddingLeft: 15,
  },
});
