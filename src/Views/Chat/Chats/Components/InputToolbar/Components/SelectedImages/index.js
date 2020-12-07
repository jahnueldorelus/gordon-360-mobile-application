import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

export const SelectedImages = (props) => {
  const [imageDimensions, setImageDimensions] = useState([]);
  const [scrollViewContentSizeWidth, setScrollViewContentSizeWidth] = useState(
    null
  );
  const scrollRef = useRef();

  // Sets the dimensions of the image within the maximum height of 150
  useEffect(() => {
    // Temp object to hold all images' dimensions
    let objDimensions = [...imageDimensions];

    // Parses through the list of images
    props.images.forEach((img, index) => {
      // Checks to see if the dimensions of the image has already been made.
      // If not, the image's dimensions are created
      if (!imageDimensions[index]) {
        Image.getSize(img, (width, height) => {
          // Calculates the ratio that will be used to configure the image's width
          let ratio = 150 / height;
          // Sets the images width as 150 since that's the height we want all images to be
          height = 150;
          // Sets the width of the image based on the calculated ratio
          width *= ratio;

          // Saves the new dimensions of the image
          objDimensions[index] = { width, height };
          setImageDimensions(objDimensions);
        });
      }
    });
  }, [props.images]);

  const removeImage = (imageIndex) => {
    // Removes the dimensions for the image
    let newImageDimensions = [...imageDimensions];
    newImageDimensions.splice(imageIndex, 1);
    setImageDimensions(newImageDimensions);

    // Removes and saves the new list of user selected images
    let newSelectedImages = [...props.images];
    newSelectedImages.splice(imageIndex, 1);
    // The images are set in a JSON object in order for useEffect() in
    // hook components to recognize that there's a new value change
    props.setSelectedImages(JSON.stringify(newSelectedImages));
  };

  // The list of JSX for each user selected image
  const Images = () => {
    return (
      // Parses the JSON object to get the array before attempting to use it
      props.images.map((img, index) => {
        // Determines the dimensions of the image
        const imageStyle = {
          width: imageDimensions[`${index}`]
            ? imageDimensions[`${index}`].width
            : null,
          height: imageDimensions[`${index}`]
            ? imageDimensions[`${index}`].height
            : null,
        };

        /**
         * Checks to see if the image's dimension's are available. If not,
         * a loading image is shown instead
         */
        if (imageStyle.width && imageStyle.height) {
          return (
            <ImageBackground
              key={index}
              style={[styles.imageContainer, imageStyle]}
              imageStyle={imageStyle}
              source={{ uri: img }}
            >
              <Icon
                name="cancel"
                type="material"
                color="white"
                containerStyle={styles.imageIconContainer}
                iconStyle={styles.imageIcon}
                onPress={() => removeImage(index)}
              />
            </ImageBackground>
          );
        } else {
          return (
            <View style={styles.loaderContainer} key={index}>
              <ActivityIndicator
                size="small"
                color="rgba(1, 73, 131, 0.7)"
                style={styles.loader}
              />
            </View>
          );
        }
      })
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        marginBottom: 11,
      }}
      onContentSizeChange={(newWidth) => {
        // Scroll view scrolls to the end of the list only if a new
        // image has been added
        if (newWidth > scrollViewContentSizeWidth) {
          scrollRef.current.scrollToEnd({ animated: true });
          setScrollViewContentSizeWidth(newWidth);
        }
      }}
      onLayout={({ nativeEvent }) => {
        setScrollViewContentSizeWidth(nativeEvent.layout.width);
      }}
    >
      {Images()}
    </ScrollView>
  );
};

// The style of this component
const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#15476f",
  },
  imageIconContainer: {
    marginHorizontal: 5,
    marginTop: 5,
    alignSelf: "flex-start",
    backgroundColor: "#014983",
    borderRadius: 50,
  },
  loaderContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "rgba(21, 71, 111, 0.3)",
    justifyContent: "center",
  },
  loader: {
    marginHorizontal: 30,
  },
});
