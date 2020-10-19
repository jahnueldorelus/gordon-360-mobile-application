import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Animated,
} from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";

/**
 * Just a function that calls the real component MessageImage
 * @param {JSON} props Props passed from parent
 */
export const renderMessageImage = (props) => {
  return <MessageImage {...props} />;
};

/**
 * Renders the message image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
const MessageImage = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [previewVisible, setPreviewVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingTop: 10,
      marginBottom: 6,
    },
    image: {
      maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
      height: deviceHeight / 4,
      borderRadius: 5,
    },
  });

  {
    /* *************************************************************************** */
  }
  let previewZoomScale = new Animated.Value(1);

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {
          scale: previewZoomScale,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(previewZoomScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  {
    /* *************************************************************************** */
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setPreviewVisible(true)}>
        <Image
          style={styles.image}
          source={{ uri: props.currentMessage.image }}
        />
      </TouchableOpacity>
      <Modal
        visible={previewVisible}
        presentationStyle="fullscreen"
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
        onDismiss={() => setPreviewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          {/* <ImageViewer
            imageUrls={[{ url: props.currentMessage.image }]}
            backgroundColor="black"
            enableSwipeDown
            onSwipeDown={() => setPreviewVisible(false)}
            swipeDownThreshold={200}
            renderHeader={() => (
              <View style={{ flex: 1, backgroundColor: "red" }}>
                <Text style={{ color: "white" }}>HEY THERE</Text>
              </View>
            )}
          /> */}
          <View style={{ backgroundColor: "#014983" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 10,
                color: "white",
              }}
              onPress={() => setPreviewVisible(false)}
            >
              Tap Here to Close Preview
            </Text>
          </View>
          <View
            style={{ flex: 1, backgroundColor: "white", overflow: "hidden" }}
          >
            {/* *************************************************************************** */}

            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
              style={{ flex: 1 }}
            >
              <Animated.Image
                style={{
                  flex: 1,
                  transform: [{ scale: previewZoomScale }],
                }}
                source={{ uri: props.currentMessage.image }}
                resizeMode="contain"
              />
              {/* <Image
              style={{
                flex: 1,
                resizeMode: "contain",
              }}
              source={{ uri: props.currentMessage.image }}
            /> */}
            </PinchGestureHandler>

            {/* *************************************************************************** */}
          </View>
          <View style={{ backgroundColor: "#014983" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 10,
                color: "white",
              }}
              onPress={() => setPreviewVisible(false)}
            >
              Tap Here to Close Preview
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
