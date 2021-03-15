import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import {
  setSelectedFilterSectionName,
  resetSelectedFilterSectionItem,
  getSelectedFilterName,
} from "../../../../../../../store/ui/peopleSearchFilter";
import { useDispatch, useSelector } from "react-redux";

export const FilterSection = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The selected filter's name
  const filterName = useSelector(getSelectedFilterName);

  return (
    <View
      key={props.index}
      style={[
        styles.filterContentContainer,
        {
          borderBottomWidth:
            Object.values(props.selectedFilterObj).length - 1 !== props.index
              ? 1
              : 0,
        },
      ]}
    >
      <Icon name="clipboard" type="font-awesome-5" color="#224d85" size={20} />
      <Text style={styles.filterContentSectionTitle}>{props.sectionName}:</Text>
      {/* Deterimines the filter section will be plain text or a touchable component */}
      {props.data ? (
        <Text
          style={styles.filterContentSectionSelectedItemText}
          numberOfLines={1}
        >
          {props.itemSelected ? props.itemSelected : "All"}
        </Text>
      ) : (
        <TouchableHighlight
          underlayColor="none"
          style={styles.filterContentSectionSelectedItemInput}
          onPress={() => {
            // Sets the data of the focused text input in the parent component
            props.setFocusedTextInput({
              selected: props.itemSelected,
              sectionName: props.sectionName,
            });
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: 18, color: "#5072ba" }}>
            {props.itemSelected ? props.itemSelected : "Tap here to type..."}
          </Text>
        </TouchableHighlight>
      )}
      {props.data ? (
        <View style={styles.filterContentSectionActions}>
          <Icon
            name={props.itemSelected ? "edit" : "plus"}
            type="font-awesome-5"
            color="#224d85"
            size={20}
            onPress={() => {
              // Opens the list picker for the filter section
              props.setListPickerVisible(true);
              // Saves the selected item to Redux state
              dispatch(setSelectedFilterSectionName(props.sectionName));
            }}
            containerStyle={[
              styles.filterContentSectionActionsAddEdit,
              { marginRight: props.itemSelected ? 20 : 0 },
            ]}
          />
          {props.itemSelected && (
            <Icon
              name="trash"
              type="font-awesome-5"
              color="#224d85"
              size={20}
              onPress={() => {
                // Resets the selected filter's selected section's selected item
                dispatch(
                  resetSelectedFilterSectionItem(filterName, props.sectionName)
                );
              }}
              containerStyle={styles.filterContentSectionActionsTrash}
            />
          )}
        </View>
      ) : (
        <Icon
          disabled={!props.itemSelected}
          name={"times-circle"}
          type="font-awesome-5"
          color="#224d85"
          size={20}
          onPress={() =>
            dispatch(
              resetSelectedFilterSectionItem(filterName, props.sectionName)
            )
          }
          containerStyle={styles.filterContentSectionActionsRemoveInput}
          disabledStyle={styles.filterContentSectionActionsRemoveInputDisabled}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContentContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#5072ba",
  },
  filterContentSectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#224d85",
  },
  filterContentSectionSelectedItemText: {
    marginLeft: 5,
    fontSize: 16,
    flex: 1,
    fontWeight: "normal",
    color: "#5072ba",
    paddingVertical: 13,
  },
  filterContentSectionSelectedItemInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#5072ba",
    paddingVertical: 13,
  },
  filterContentSectionActions: { flexDirection: "row", alignItems: "center" },
  filterContentSectionActionsAddEdit: {
    padding: 6,
  },
  filterContentSectionActionsTrash: {
    padding: 6,
  },
  filterContentSectionActionsRemoveInput: {
    marginLeft: 15,
    padding: 5,
  },
  filterContentSectionActionsRemoveInputDisabled: {
    backgroundColor: "transparent",
    opacity: 0.2,
  },
});
