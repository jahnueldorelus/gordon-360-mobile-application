import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon } from "react-native-elements";

export const WebViewError = (props) => {
  return (
    <View style={styles.errorContainer}>
      <ScrollView
      /**
       * Scroll indicator prevents glitch with scrollbar appearing
       * in the middle of the screen
       */
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View style={styles.errorView}>
          <Icon
            containerStyle={styles.errorViewImage}
            type="font-awesome-5"
            name="exclamation-circle"
            size={70}
            color="#001322"
          />
          <Text style={[styles.errorText, styles.errorTextTitle]}>
            Uh-oh! It appears an error occured!
          </Text>
          {props.loadingError && (
            <Text style={[styles.errorText, styles.errorTextDescription]}>
              <Text style={styles.errorTextDescriptionBold}>Error:</Text>{" "}
              {props.loadingError.description}
            </Text>
          )}
          <Text style={[styles.errorText, styles.errorTextRefresh]}>
            Please click on the refresh button above to reload the last working
            page.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

let styles = StyleSheet.create({
  errorContainer: {
    height: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  errorView: {
    borderColor: "#001F37",
    borderWidth: 2,
    padding: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  errorViewImage: {
    tintColor: "#d3ebff",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 22,
    textAlign: "center",
  },
  errorTextTitle: {
    color: "#012849",
    marginBottom: 20,
  },
  errorTextDescription: {
    color: "#014983",
  },
  errorTextDescriptionBold: { fontWeight: "600" },
  errorTextRefresh: {
    marginTop: 20,
    color: "#015faa",
  },
});
