import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { getUserInvolvements } from "../../../../store/entities/profile";

export const Involvements = () => {
  // User's involvementss
  const userInvolvements = useSelector(getUserInvolvements);

  return (
    <View>
      <Text style={styles.listTitle}>Involvements</Text>

      {userInvolvements ? (
        userInvolvements.map((involvement, index) => {
          return (
            <LinearGradient
              key={index}
              // Background Linear Gradient
              colors={["#014983", "#001E35"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.involvementsCard}
            >
              <View style={styles.involvDescripPartContainer}>
                <View style={styles.involvDescription}>
                  <Text style={styles.listItemValue}>
                    {involvement.SessionDescription.trim()}
                  </Text>
                </View>
                <View style={styles.involvParticipationContainer}>
                  <View style={styles.involvParticipationTextContainer}>
                    <Text style={styles.involvParticipationText}>
                      {involvement.ParticipationDescription.trim()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.involvInfoContainer}>
                <Image
                  source={{
                    uri: involvement.ActivityImagePath,
                  }}
                  style={styles.involvInfoImage}
                />
                <View>
                  <Text style={[styles.listItemName, { textAlign: "right" }]}>
                    {involvement.ActivityTypeDescription.trim()}
                  </Text>
                  <Text style={[styles.listItemValue, { textAlign: "right" }]}>
                    {involvement.ActivityDescription.trim()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          );
        })
      ) : (
        <Text style={styles.noInvolvementsText}>
          Involvements are currently unavailable.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listTitle: { fontSize: 24, marginBottom: 5, color: "#014983" },
  listItemName: {
    fontSize: 18,
    color: "#acdafe",
  },
  listItemValue: {
    color: "white",
    fontSize: 18,
  },
  involvementsCard: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  noInvolvementsText: {
    fontSize: 18,
  },
  involvDescripPartContainer: { flexDirection: "row", marginBottom: 10 },
  involvDescription: { flex: 1 },
  involvParticipationContainer: { justifyContent: "center" },
  involvParticipationTextContainer: {
    marginLeft: 20,
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
  },
  involvParticipationText: {
    color: "#014983",
    fontSize: 16,
    textAlign: "center",
  },
  involvInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  involvInfoImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
  },
});
