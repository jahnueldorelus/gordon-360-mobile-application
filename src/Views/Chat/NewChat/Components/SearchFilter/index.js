import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CustomModal } from "../../../../../Components/CustomModal/index";
import {
  fetchFilterData,
  getFilterObject,
  resetAllFilters,
} from "../../../../../store/ui/peopleSearchFilter";
import { ListPickerModal } from "./Components/ListPicker/index";
import { FilterSection } from "./Components/FilterSection/index";
import { FocusedTextInput } from "./Components/FocusedTextInput/index";
import { FilterHeader } from "./Components/FilterHeader/index";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import { getDeviceOrientation } from "../../../../../store/ui/app";

export const SearchFilter = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The selected filter object containing its sections
  const selectedFilterObj = useSelector(getFilterObject);
  // Show filter list picker
  const [listPickerVisible, setListPickerVisible] = useState(false);
  // Focused Text Input Data
  const [focusedTextInput, setFocusedTextInput] = useState({});
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);

  useEffect(() => {
    // Fetches the filter's data for each section
    dispatch(fetchFilterData);
    dispatch(resetAllFilters);
  }, []);

  /**
   * Creates the content of each search filter section
   */
  const getFilterContent = () =>
    Object.values(selectedFilterObj).map((section, index) => {
      return (
        <FilterSection
          key={index}
          index={index}
          itemSelected={section.selected}
          sectionName={section.sectionName}
          data={section.data}
          icon={section.icon}
          selectedFilterObj={selectedFilterObj}
          setListPickerVisible={setListPickerVisible}
          setFocusedTextInput={setFocusedTextInput}
        />
      );
    });

  // If the device's orientation is in portrait mode
  if (screenOrientation === "portrait") {
    /**
     * If there's focused text input data, the focused text input
     * is shown so that the user can type in their input for their selected
     * filter section. If not, the regular filter modal is displayed
     */
    return JSON.stringify(focusedTextInput) === JSON.stringify({}) ? (
      <SafeAreaView>
        <CustomModal
          coverScreen={true}
          visible={props.visible}
          roundedCorners={true}
          content={
            <View>
              <FilterHeader />
              {getFilterContent()}

              <ListPickerModal
                listPickerVisible={listPickerVisible}
                setListPickerVisible={setListPickerVisible}
              />
            </View>
          }
        />
      </SafeAreaView>
    ) : (
      <FocusedTextInput
        visible={props.visible}
        focusedTextInput={focusedTextInput}
        setFocusedTextInput={setFocusedTextInput}
      />
    );
  }
  // If the device's orientation is in landscape mode
  else if (screenOrientation === "landscape") {
    // Determines if focused text input is available
    const focusedTextInputAvailable =
      JSON.stringify(focusedTextInput) !== JSON.stringify({});
    return (
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        visible={props.visible}
      >
        <SafeAreaView style={styles.safeArea}>
          <View
            style={[
              styles.navigationBar,
              { paddingVertical: focusedTextInputAvailable ? 10 : "auto" },
            ]}
          >
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => {
                // Closes out the modal
                props.setVisible(!props.visible);
              }}
            >
              <Icon
                name="arrow-circle-left"
                type="font-awesome-5"
                color="white"
                size={30}
              />
              <Text style={styles.navigationButtonText}>Close Filters</Text>
            </TouchableOpacity>
          </View>
          <View
            style={styles.filterContent}
            pointerEvents={focusedTextInputAvailable ? "none" : "auto"}
          >
            <FilterHeader />
            {getFilterContent()}

            <ListPickerModal
              listPickerVisible={listPickerVisible}
              setListPickerVisible={setListPickerVisible}
            />

            {
              /**
               * Blocks the user from selecting any filters while
               * the focused text input is visible
               */
              focusedTextInputAvailable && (
                <View style={styles.filterContentBlocker} />
              )
            }
          </View>

          {
            /**
             * If there's focused text input data, the focused text input
             * is shown so that the user can type in their input for their selected
             * filter section. If not, the regular filter modal is displayed
             */
            focusedTextInputAvailable && (
              <FocusedTextInput
                visible={props.visible}
                focusedTextInput={focusedTextInput}
                setFocusedTextInput={setFocusedTextInput}
              />
            )
          }
        </SafeAreaView>
      </Modal>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  filterContent: { backgroundColor: "white", height: "100%" },
  filterContentBlocker: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    bottom: 0,
    right: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  navigationBar: {
    paddingHorizontal: "3%",
    paddingTop: 10,
    backgroundColor: "#224d85",
  },
  navigationButton: { flexDirection: "row", alignItems: "center" },
  navigationButtonText: {
    marginLeft: 10,
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
});
