import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableHighlight,
} from "react-native";
import { CustomModal } from "../../../../../Components/CustomModal/index";
import { ButtonGroup, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import {
  fetchFilterData,
  getFilterNames,
  getSelectedFilterIndex,
  setSelectedFilterIndex,
  getSelectedFilterName,
  getFilterObject,
  getSelectedFilterSectionName,
  setSelectedFilterSectionName,
  getSelectedFilterSectionData,
  getSelectedFilterSectionItem,
  setSelectedFilterSectionItem,
  resetSelectedFilterSectionItem,
} from "../../../../../store/ui/peopleSearchFilter";
import { useDispatch, useSelector } from "react-redux";

export const SearchFilter = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The Safe Area Insets for Apple devices with safe area views
  const insets = useSafeAreaInsets();

  // List of filters
  const filters = useSelector(getFilterNames);

  // Decides which filter is selected
  const selectedFilterIndex = useSelector(getSelectedFilterIndex);

  // The selected filter's name
  const filterName = useSelector(getSelectedFilterName);

  // The selected filter's selected section's name
  const sectionName = useSelector(getSelectedFilterSectionName);

  // The data of the selected section in the selected filter
  const sectionData = useSelector(getSelectedFilterSectionData);

  // The selected item of the selected section in the selected filter
  const sectionSelectedItem = useSelector(getSelectedFilterSectionItem);

  // The selected filter object containing its sections
  const selectedFilterObj = useSelector(getFilterObject);

  // Show filter list picker
  const [listPickerVisible, setListPickerVisible] = useState(false);

  useEffect(() => {
    // Fetches the filter's data for each section
    dispatch(fetchFilterData);
  }, []);

  /**
   * Creates the header content of the filter
   */
  const getFilterHeader = () => {
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
          onPress={() => props.setVisible(false)}
        />
      </View>
    );
  };

  /**
   * Creates the content of each search filter section
   */
  const getFilterContent = () =>
    Object.values(selectedFilterObj).map((section, index) => {
      // Section name
      const sectionName = section.filterName;
      // Section selected item
      const itemSelected = section.selected;

      return (
        <View
          key={index}
          style={[
            styles.filterContentContainer,
            {
              borderBottomWidth:
                Object.values(selectedFilterObj).length - 1 !== index ? 1 : 0,
            },
          ]}
        >
          <Icon
            name="clipboard"
            type="font-awesome-5"
            color="#224d85"
            size={20}
          />
          <Text style={styles.filterContentSectionTitle}>{sectionName}:</Text>
          {section.data ? (
            <Text
              style={styles.filterContentSectionSelectedItemText}
              numberOfLines={1}
            >
              {itemSelected ? itemSelected : "All"}
            </Text>
          ) : (
            <TextInput
              placeholder="Tap here to type..."
              placeholderTextColor="#5072ba"
              selectTextOnFocus
              style={styles.filterContentSectionSelectedItemInput}
              value={itemSelected}
              onChangeText={(text) =>
                // Saves the new text to redux
                dispatch(
                  setSelectedFilterSectionItem(filterName, sectionName, text)
                )
              }
            />
          )}
          {section.data ? (
            <View style={styles.filterContentSectionActions}>
              <Icon
                name={itemSelected ? "edit" : "plus"}
                type="font-awesome-5"
                color="#224d85"
                size={20}
                onPress={() => {
                  setListPickerVisible(true);
                  dispatch(setSelectedFilterSectionName(sectionName));
                }}
                containerStyle={[
                  styles.filterContentSectionActionsAddEdit,
                  { marginRight: itemSelected ? 20 : 0 },
                ]}
              />
              {itemSelected && (
                <Icon
                  name="trash"
                  type="font-awesome-5"
                  color="#224d85"
                  size={20}
                  onPress={() => {
                    // Resets the selected filter's selected section's selected item
                    dispatch(
                      resetSelectedFilterSectionItem(filterName, sectionName)
                    );
                  }}
                  containerStyle={styles.filterContentSectionActionsTrash}
                />
              )}
            </View>
          ) : (
            <Icon
              disabled={!itemSelected}
              name={"times-circle"}
              type="font-awesome-5"
              color="#224d85"
              size={20}
              onPress={() =>
                dispatch(
                  resetSelectedFilterSectionItem(filterName, sectionName)
                )
              }
              containerStyle={styles.filterContentSectionActionsRemoveInput}
              disabledStyle={
                styles.filterContentSectionActionsRemoveInputDisabled
              }
            />
          )}
        </View>
      );
    });

  return (
    <CustomModal
      coverScreen={true}
      visible={props.visible}
      roundedCorners={true}
      content={
        <View style={{ paddingBottom: insets.bottom }}>
          {getFilterHeader()}
          {getFilterContent()}

          {/* CODE BELOW WILL BE PLACED IN ANOTHER COMPONENT */}
          <Modal
            visible={listPickerVisible}
            presentationStyle="pageSheet"
            animationType="slide"
            onRequestClose={() => setListPickerVisible(false)}
            onDismiss={() => setListPickerVisible(false)}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  padding: 20,
                  backgroundColor: "#224d85",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "white",
                      fontWeight: "bold",
                      maxWidth: "85%",
                    }}
                  >
                    {`Filter - ${filterName} by ${sectionName}`}
                  </Text>
                  <Icon
                    name="close"
                    type="material"
                    color="white"
                    size={35}
                    onPress={() => {
                      // Exits out the filter section picker modal
                      setListPickerVisible(false);
                    }}
                    containerStyle={{
                      marginHorizontal: 5,
                    }}
                  />
                </View>
                {sectionSelectedItem && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {`Currently Selected - ${sectionSelectedItem}`}
                  </Text>
                )}

                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 16,
                    color: "white",
                  }}
                >{`Select a ${sectionSelectedItem ? "new " : ""}${
                  sectionName ? sectionName.toLowerCase() : ""
                } below`}</Text>
              </View>
              <FlatList
                data={sectionData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicators
                renderItem={({ item, index }) => {
                  return (
                    <View key={index}>
                      <TouchableHighlight
                        underlayColor="none"
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 12,
                          borderBottomColor: "#224d85",
                          borderBottomWidth:
                            sectionData.length - 1 === index ? 0 : 1,
                        }}
                        onPress={() => {
                          // Sets the selected filter's selected section selected item
                          dispatch(
                            setSelectedFilterSectionItem(
                              filterName,
                              sectionName,
                              item
                            )
                          );
                          // Exits out the filter section picker modal
                          setListPickerVisible(false);
                        }}
                      >
                        <Text style={{ fontSize: 18, color: "#224d85" }}>
                          {item}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  );
                }}
              />
            </SafeAreaView>
          </Modal>
        </View>
      }
    />
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
    marginLeft: 20,
    padding: 5,
  },
  filterContentSectionActionsRemoveInputDisabled: {
    backgroundColor: "transparent",
    opacity: 0.2,
  },
});
