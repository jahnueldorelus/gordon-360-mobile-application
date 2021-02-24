import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  LayoutAnimation,
  Modal,
  SafeAreaView,
} from "react-native";
import { CustomModal } from "../../../../../Components/CustomModal/index";
import { ButtonGroup, Icon, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { data } from "../../tempData";
import { useDispatch } from "react-redux";

export const SearchFilter = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The Safe Area Insets for Apple devices with safe area views
  const insets = useSafeAreaInsets();

  // List of filters
  const filters = ["Academics", "Home", "Office"];

  // Decides which filter is selected
  const [selectedFilter, setSelectedFilter] = useState(0);

  // Text Input
  const [textInput, setTextInput] = useState({});

  // Text Input Placeholder
  const [placeholder, setPlaceholder] = useState("Tap here to type...");

  // Show filter list picker
  const [listPickerVisible, setListPickerVisible] = useState(false);

  // Configures the animation for the entire component
  LayoutAnimation.easeInEaseOut();

  /**
   * Creates the content of each search filter section
   */
  const getFilterContent = () => {
    // Gets the correct data to parse
    const content =
      filters[selectedFilter] === "Academics"
        ? data.academic
        : filters[selectedFilter] === "Home"
        ? data.home
        : data.office;

    return Object.values(content).map((section, index) => {
      // Section name
      const sectionName = section.filterName;
      // Section selected item
      const itemSelected = section.selected;

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
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth:
              Object.values(content).length - 1 !== index ? 1 : 0,
            borderBottomColor: "#5072ba",
          }}
        >
          <Icon
            name="clipboard"
            type="font-awesome-5"
            color="#224d85"
            size={20}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "bold",
              color: "#224d85",
            }}
          >
            {sectionName}:
          </Text>
          {section.data ? (
            <Text
              style={{
                marginLeft: 5,
                fontSize: 16,
                flex: 1,
                fontWeight: "normal",
                color: "#5072ba",
                paddingVertical: 13,
              }}
              numberOfLines={1}
            >
              {itemSelected ? itemSelected : "All"}
            </Text>
          ) : (
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#5072ba"
              selectTextOnFocus
              style={{
                flex: 1,
                fontSize: 16,
                marginLeft: 10,
                color: "#5072ba",
                paddingVertical: 13,
              }}
              value={textInput[sectionName]}
              onChangeText={(text) =>
                setTextInput({ ...textInput, [sectionName]: text })
              }
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder("Tap here to type...")}
            />
          )}
          {section.data ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name={itemSelected ? "edit" : "plus"}
                type="font-awesome-5"
                color="#224d85"
                size={20}
                onPress={() => setListPickerVisible(true)}
                containerStyle={{
                  padding: 6,
                  marginHorizontal: itemSelected ? 20 : 0,
                }}
              />
              {itemSelected && (
                <Icon
                  name="trash"
                  type="font-awesome-5"
                  color="#224d85"
                  size={20}
                  onPress={() => {
                    data.selected = null;
                  }}
                  containerStyle={{
                    padding: 6,
                  }}
                />
              )}
            </View>
          ) : textInput[sectionName] && textInput[sectionName] !== "" ? (
            <Icon
              name={"times-circle"}
              type="font-awesome"
              color="#224d85"
              size={20}
              onPress={() => setTextInput({ ...textInput, [sectionName]: "" })}
              containerStyle={{
                marginLeft: 20,
                padding: 6,
              }}
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
          <View
            style={{
              backgroundColor: "#224d85",
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <ButtonGroup
                onPress={(index) => setSelectedFilter(index)}
                selectedIndex={selectedFilter}
                buttons={filters}
                containerStyle={{
                  borderWidth: 0,
                  borderRadius: 50,
                  marginLeft: 0,
                  marginRight: 20,
                }}
                textStyle={{ fontSize: 15, color: "#5072ba" }}
                selectedButtonStyle={{ backgroundColor: "#5072ba" }}
              />
            </View>
            <Icon
              name="times"
              type="font-awesome-5"
              color="white"
              size={30}
              onPress={() => props.setVisible(false)}
              containerStyle={{ marginRight: 5 }}
            />
          </View>
          <View style={{ paddingHorizontal: 20, paddingTop: 5 }}>
            {getFilterContent()}
          </View>
          <Button
            icon={
              <Icon
                name="filter"
                type="font-awesome-5"
                color="#c0cce6"
                size={17}
              />
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

          <Modal
            visible={listPickerVisible}
            presentationStyle="pageSheet"
            animationType="slide"
            onRequestClose={() => setListPickerVisible(false)}
            onDismiss={() => setListPickerVisible(false)}
          >
            <SafeAreaView
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 20 }}
                onPress={() => setListPickerVisible(false)}
              >
                CLOSE MODAL
              </Text>
            </SafeAreaView>
          </Modal>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({});
