import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";

const SelectedImages = (props) => {
  // A list that contains the dimensions of each image
  const [imageDimensions, setImageDimensions] = useState([]);
  // The list of user selected images
  const imageList = props.ImageHandler.selectedImages;

  /**
   * Variables used to determine if the scroll bar for the images should
   * scroll all the way to the end of the list. The scroll bar will automatically
   * scroll itself to the end of the list if a new image is added.
   */
  const [scrollViewContentSizeWidth, setScrollViewContentSizeWidth] =
    useState(null);
  const scrollRef = useRef();
  const oldScrollViewWidthRef = useRef(0);

  /**
   * Sets the dimensions of each image. Each image is given a height of 150.
   */
  useEffect(() => {
    // Temp object to hold a copy of all images' dimensions
    let objDimensions = [...imageDimensions];

    // Parses through the list of new images
    imageList.forEach((img, index) => {
      /**
       * Checks to see if the dimensions of the image has already been made.
       * If not, the image's dimensions are created
       */
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
  }, [imageList]);

  /**
   * Removes the image from the list of images
   * @param {number} imageIndex the index of the image in the list of images
   */
  const removeImage = (imageIndex) => {
    // Removes the dimensions for the image and saves the new list of dimensions
    let newImageDimensions = [...imageDimensions];
    newImageDimensions.splice(imageIndex, 1);
    setImageDimensions(newImageDimensions);

    // Removes and saves the new list of user selected images
    let newSelectedImages = [...imageList];
    newSelectedImages.splice(imageIndex, 1);

    // Sets the new selected images list
    props.ImageHandler.setSelectedImages(newSelectedImages);
  };

  // The list of JSX for each user selected image
  const getImages = () => {
    return (
      // Iterates through the list of images and returns the JSX of each one
      imageList.map((img, index) => {
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
            <TouchableOpacity
              activeOpacity={0.75}
              key={index}
              onPress={() => {
                // Saves the image to be shown
                props.ImageToViewHandler.setImage(img);
                // Opens the image viewer
                props.ImageToViewHandler.openImageViewer();
              }}
            >
              <ImageBackground
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
            </TouchableOpacity>
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

  // Displays user selected images if there are any
  if (imageList.length > 0)
    return (
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        /**
         * Removes spacing on the bottom of the selected image(s) when the
         * actions buttons for the input toolbar are visible
         */
        style={{ marginBottom: props.showActions ? 0 : 11 }}
        onContentSizeChange={(newWidth) => {
          /**
           * Scrolls to the end of the list only if a new image has been added.
           * This is done by evaluating the new width. If the new width is greater
           * than the old and the new width surpasses the initial width of the scroll
           * bar (aka the image will be rendered off screen), then the scroll bar
           * scrolls to the end of the list so that the user can see the new image
           * that they added.
           */
          if (
            newWidth > scrollViewContentSizeWidth &&
            oldScrollViewWidthRef.current < newWidth
          ) {
            scrollRef.current.scrollToEnd({ animated: true });
          }
          oldScrollViewWidthRef.current = newWidth;
        }}
        onLayout={({ nativeEvent }) => {
          /**
           * Sets the initial width of the scroll bar on the entire screen.
           * This value never changes. It will always remain as the width of the
           * scroll bar when it was first rendered.
           */
          setScrollViewContentSizeWidth(nativeEvent.layout.width);
          // Also sets the old width of the scroll bar as its initial width
          if (oldScrollViewWidthRef.current === 0)
            oldScrollViewWidthRef.current = nativeEvent.layout.width;
        }}
      >
        {getImages()}
      </ScrollView>
    );
  // Displays nothing if there are no user selected images
  else return <></>;
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

/**
 * Determines if the component has the same images. If so,
 * the component doesn't re-render. This is to save performance
 * from computing image dimensions.
 * @param {Object} prevProps The previous props of the component
 * @param {Object} nextProps The new props of the component
 */
export default React.memo(SelectedImages, (prevProps, nextProps) => {
  return (
    prevProps.ImageHandler.selectedImages.length ===
      nextProps.ImageHandler.selectedImages.length &&
    prevProps.showActions === nextProps.showActions
  );
});
