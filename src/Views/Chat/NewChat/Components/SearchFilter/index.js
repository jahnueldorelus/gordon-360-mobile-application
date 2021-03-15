import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
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

export const SearchFilter = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The selected filter object containing its sections
  const selectedFilterObj = useSelector(getFilterObject);

  // Show filter list picker
  const [listPickerVisible, setListPickerVisible] = useState(false);

  // Focused Text Input Data
  const [focusedTextInput, setFocusedTextInput] = useState({});

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
          selectedFilterObj={selectedFilterObj}
          setListPickerVisible={setListPickerVisible}
          setFocusedTextInput={setFocusedTextInput}
        />
      );
    });

  /**
   * If there's focused text input data, the focused text input
   * is shown so that the user can type in their input for their selected
   * filter section. If not, the regular filter modal is displayed
   */
  return jQuery.isEmptyObject(focusedTextInput) ? (
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
};
