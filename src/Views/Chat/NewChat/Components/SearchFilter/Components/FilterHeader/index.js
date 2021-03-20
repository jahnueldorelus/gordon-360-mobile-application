import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ButtonGroup, Icon } from "react-native-elements";
import {
  setSelectedFilterIndex,
  resetAllFilters,
  getSelectedFilterIndex,
  getFilterNames,
  getSelectedItemsAndNames,
} from "../../../../../../../store/ui/peopleSearchFilter";
import { useDispatch, useSelector } from "react-redux";

export const FilterHeader = () => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // List of filters
  const filters = useSelector(getFilterNames);

  // Decides which filter is selected
  const selectedFilterIndex = useSelector(getSelectedFilterIndex);

  // The object of seleced filters
  const selectedFilterData = useSelector(getSelectedItemsAndNames);

  return (
    <View style={styles.filterGroup}>
      <ButtonGroup
        onPress={(index) => dispatch(setSelectedFilterIndex(index))}
        selectedIndex={selectedFilterIndex}
        buttons={filters}
        containerStyle={styles.filterGroupButtonsContainer}
        textStyle={styles.filterGroupButtonsText}
        selectedButtonStyle={styles.filterGroupButtonStyle}
      />
      <Icon
        name="filter-remove"
        type="material-community"
        color="white"
        size={30}
        disabled={selectedFilterData.nameAndItem.length === 0}
        disabledStyle={styles.filterGroupButtonReset}
        onPress={() => {
          Alert.alert(
            "Resetting All Filters",
            "Are you sure you want to reset all filters?",
            [
              {
                text: "Reset All",
                onPress: () => dispatch(resetAllFilters),
              },
              {
                text: "Cancel",
                onPress: () => {}, // Does nothing
                style: "cancel",
              },
            ]
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterGroup: {
    backgroundColor: "#224d85",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterGroupButtonsContainer: {
    borderWidth: 0,
    borderRadius: 50,
    marginLeft: 0,
    flex: 1,
    marginRight: 15,
  },
  filterGroupButtonsText: { fontSize: 15, color: "#5072ba" },
  filterGroupButtonStyle: { backgroundColor: "#5072ba" },
  filterGroupButtonReset: { backgroundColor: "transparent", opacity: 0.3 },
});
