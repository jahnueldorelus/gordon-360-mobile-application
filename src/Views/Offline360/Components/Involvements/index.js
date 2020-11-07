import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const Involvements = (props) => {
  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 5, color: "#014983" }}>
        Involvements
      </Text>
      {props.userInvolvements.map((involvement, index) => {
        return (
          <LinearGradient
            key={index}
            // Background Linear Gradient
            colors={["#014983", "#001E35"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={props.styles.involvementsCard}
          >
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={props.styles.listItemValue}>
                  {involvement.SessionDescription.trim()}
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <View
                  style={{
                    marginLeft: 20,
                    backgroundColor: "white",
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    justifyContent: "center",
                    // flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#014983",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {involvement.ParticipationDescription.trim()}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: involvement.ActivityImagePath,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: "white",
                }}
              />
              <View>
                <Text
                  style={[props.styles.listItemName, { textAlign: "right" }]}
                >
                  {involvement.ActivityTypeDescription.trim()}
                </Text>
                <Text
                  style={[props.styles.listItemValue, { textAlign: "right" }]}
                >
                  {involvement.ActivityDescription.trim()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        );
      })}
    </View>
  );
};
