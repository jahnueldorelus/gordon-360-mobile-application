import React, { useState, useCallback, useEffect } from "react";
import { Button, View, StyleSheet, Dimensions,Text } from "react-native";
import { Card, ListItem, Icon } from 'react-native';
import Rooms from "./components/Rooms";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const createRooms =()=> {
    return (
        <Card>
        {
          Rooms.map((u, i) => {
            return (
              <View key={i} style={styles.user}>
                <Text style={styles.name}>{u.user.name}</Text>
                <ListItem
                  key={i}
                  roundAvatar
                  title={u.user.namename}
                  leftAvatar={{ source: { uri: u.user.avatar } }}
                /> 
              </View>
            );
          })
        }
      </Card>
    );
  }

  const styles = StyleSheet.create({
    user: {
      flex: 1,
      backgroundColor: "black",
      width: deviceWidth,
      height: deviceHeight,
    },

    image: {
        flex: 1,
        width: "5%",
        height: "5%",
      },

    name: {
      flex: 1,
      backgroundColor: "black",
      width: deviceWidth,
      height: deviceHeight,
    },
  });

export default createRooms;