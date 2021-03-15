import React from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  getSelectedFilterName,
  setSelectedFilterSectionItem,
  getSelectedFilterSectionItem,
  getSelectedFilterSectionName,
  getSelectedFilterSectionData,
} from "../../../../../../../store/ui/peopleSearchFilter";
import { useDispatch, useSelector } from "react-redux";

export const ListPickerModal = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The selected filter's name
  const filterName = useSelector(getSelectedFilterName);

  // The selected filter's selected section's name
  const sectionName = useSelector(getSelectedFilterSectionName);

  // The data of the selected section in the selected filter
  const sectionData = useSelector(getSelectedFilterSectionData);

  // The selected item of the selected section in the selected filter
  const sectionSelectedItem = useSelector(getSelectedFilterSectionItem);

  return (
    <Modal
      visible={props.listPickerVisible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => props.setListPickerVisible(false)}
      onDismiss={() => props.setListPickerVisible(false)}
    >
      <View style={styles.mainContainer}>
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.headerMainContainer}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>
                {`Filter - ${filterName} by ${sectionName}`}
              </Text>
              <Icon
                name="close"
                type="material"
                color="white"
                size={35}
                onPress={() => {
                  // Exits out the filter section picker modal
                  props.setListPickerVisible(false);
                }}
                containerStyle={styles.headerContainerClose}
              />
            </View>
            {sectionSelectedItem && (
              <Text style={styles.filterSelected}>
                {`Currently Selected - ${sectionSelectedItem}`}
              </Text>
            )}

            <Text style={styles.filterItemSelectTooltip}>{`Select a ${
              sectionSelectedItem ? "new " : ""
            }${sectionName ? sectionName.toLowerCase() : ""} below`}</Text>
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
                    style={[
                      styles.listItemContainer,
                      {
                        borderBottomWidth:
                          sectionData.length - 1 === index ? 0 : 1,
                      },
                    ]}
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
                      props.setListPickerVisible(false);
                    }}
                  >
                    <Text style={styles.listItemText}>{item}</Text>
                  </TouchableHighlight>
                </View>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "black" },
  safeAreaView: { flex: 1, backgroundColor: "white" },
  headerMainContainer: {
    padding: 20,
    backgroundColor: "#224d85",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitleText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    maxWidth: "85%",
  },
  headerContainerClose: {
    marginHorizontal: 5,
  },
  filterSelected: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterItemSelectTooltip: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "white",
  },
  listItemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomColor: "#224d85",
  },
  listItemText: { fontSize: 18, color: "#224d85" },
});
