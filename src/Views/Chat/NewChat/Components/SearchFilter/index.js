import React, { useState } from "react";
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
import { ButtonGroup, Icon, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { data } from "../../tempData";
import { FlatList } from "react-native-gesture-handler";

export const SearchFilter = (props) => {
  // The Safe Area Insets for Apple devices with safe area views
  const insets = useSafeAreaInsets();

  // List of filters
  const filters = ["Academics", "Home", "Office"];

  // Decides which filter is selected
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  // Text Input
  const [textInput, setTextInput] = useState({});

  // Text Input Placeholder
  const [placeholder, setPlaceholder] = useState("Tap here to type...");

  // Show filter list picker
  const [listPickerVisible, setListPickerVisible] = useState(false);

  // Show filter list picker
  const [selectedFilter, setSelectedFilter] = useState({
    filterSection: null,
    filterName: null,
    filterData: null,
    filterSelected: null,
  });

  /**
   * Creates the header content of the filter
   */
  const getFilterHeader = () => {
    return (
      <View style={styles.filterGroup}>
        <ButtonGroup
          onPress={(index) => setSelectedFilterIndex(index)}
          selectedIndex={selectedFilterIndex}
          buttons={filters}
          containerStyle={styles.filterGroupButtonsContainer}
          textStyle={styles.filterGroupButtonsText}
          selectedButtonStyle={styles.filterGroupButtonStyle}
        />
        <Icon
          name="close"
          type="material"
          color="white"
          size={35}
          onPress={() => props.setVisible(false)}
        />
      </View>
    );
  };

  /**
   * Creates the submit button of the filter
   */
  const getFilterSubmit = () => {
    return (
      <Button
        icon={
          <Icon name="filter" type="font-awesome-5" color="#c0cce6" size={17} />
        }
        title="Apply Filters"
        containerStyle={{
          alignSelf: "flex-end",
          marginRight: 20,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.29,
          shadowRadius: 5,
          elevation: 7,
        }}
        buttonStyle={{
          borderRadius: 50,
          paddingVertical: 10,
          paddingHorizontal: 15,
          margin: 10,
          backgroundColor: "#224d85",
        }}
        titleStyle={{ marginLeft: 5, fontSize: 17 }}
      />
    );
  };

  /**
   * Creates the content of each search filter section
   */
  const getFilterContent = () => {
    // Gets the correct data to parse
    const content =
      filters[selectedFilterIndex] === "Academics"
        ? data.academics
        : filters[selectedFilterIndex] === "Home"
        ? data.home
        : data.office;

    return Object.values(content).map((section, index) => {
      // Section name
      const sectionName = section.filterName;
      // Section selected item
      const itemSelected = section.selected;
      // Section selected item's data
      const itemSelectedData = section.data;

      // If the section has no data, a text holder is saved
      // in the state for the section
      if (!section.data && !textInput[sectionName]) {
        /**
         * Checks to see if the text is an empty string. This prevents
         * an infinite render since a non-defined section and a defined
         * section with an empty string returns as false in logic comparison
         */
        if (textInput[sectionName] !== "")
          setTextInput({ ...textInput, [sectionName]: "" });
      }

      return (
        <View
          key={index}
          style={[
            styles.filterContentContainer,
            {
              borderBottomWidth:
                Object.values(content).length - 1 !== index ? 1 : 0,
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
              placeholder={placeholder}
              placeholderTextColor="#5072ba"
              selectTextOnFocus
              style={styles.filterContentSectionSelectedItemInput}
              value={textInput[sectionName]}
              onChangeText={(text) =>
                setTextInput({ ...textInput, [sectionName]: text })
              }
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder("Tap here to type...")}
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
                  setSelectedFilter({
                    filterSection: sectionName,
                    filterName: filters[selectedFilterIndex],
                    filterData: itemSelectedData,
                    filterSelected: itemSelected,
                  });
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
                    // Filter name
                    const filterName = selectedFilter.filterName.toLowerCase();
                    // Filter section
                    const filterSection = selectedFilter.filterSection.toLowerCase();
                    // Changes the data to the selected
                    data[filterName][filterSection].selected = null;
                  }}
                  containerStyle={styles.filterContentSectionActionsTrash}
                />
              )}
            </View>
          ) : textInput[sectionName] && textInput[sectionName] !== "" ? (
            <Icon
              name={"times-circle"}
              type="font-awesome-5"
              color="#224d85"
              size={20}
              onPress={() => setTextInput({ ...textInput, [sectionName]: "" })}
              containerStyle={styles.filterContentSectionActionsRemoveInput}
            />
          ) : (
            <></>
          )}
        </View>
      );
    });
  };

  return (
    <CustomModal
      coverScreen={true}
      visible={props.visible}
      roundedCorners={true}
      content={
        <View style={{ paddingBottom: insets.bottom }}>
          {getFilterHeader()}
          {getFilterContent()}
          {getFilterSubmit()}

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
                    {`Filter: ${selectedFilter.filterName} by ${selectedFilter.filterSection}`}
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
                {selectedFilter.filterSelected && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {`Currently Selected: ${selectedFilter.filterSelected}`}
                  </Text>
                )}
                {selectedFilter.filterSection && (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      fontSize: 16,
                      color: "white",
                    }}
                  >{`Select a ${
                    selectedFilter.filterSelected ? "new " : ""
                  }${selectedFilter.filterSection.toLowerCase()} below`}</Text>
                )}
              </View>
              <FlatList
                data={selectedFilter.filterData}
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
                            selectedFilter.filterData.length - 1 === index
                              ? 0
                              : 1,
                        }}
                        onPress={() => {
                          // Filter name
                          const filterName = selectedFilter.filterName.toLowerCase();
                          // Filter section
                          const filterSection = selectedFilter.filterSection.toLowerCase();
                          // Changes the data to the selected
                          data[filterName][filterSection].selected = item;
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
    marginRight: 20,
    flex: 1,
    marginRight: 10,
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
});
