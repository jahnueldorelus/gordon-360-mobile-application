import AsyncStorage from "@react-native-community/async-storage";
import { get, put } from "../HTTP";

/**
 * Returns the user's profile info
 */
export async function getUserProfile() {
  let profileData = get("profiles");
  const profile = profileData.then(async (data) => {
    if (data) {
      // Saves the user's profile to storage
      await AsyncStorage.setItem("user_profile", JSON.stringify(data));
      return data;
    } else {
      // Gets the user's profile from storage if no data is available
      return JSON.parse(await AsyncStorage.getItem("user_profile"));
    }
  });

  return profile;
}

/**
 * Returns the user's image
 */
export async function getUserImage() {
  let imageData = get("profiles/image");
  const image = imageData.then(async (data) => {
    if (data) {
      /**
       * Gets the default and preferred images. There's only one or the other.
       * Either a preferred and no default or vice versa
       */
      const { def: defaultImage, pref: preferredImage } = data;
      // Saves the images to storage
      await AsyncStorage.setItem(
        "user_image",
        JSON.stringify(preferredImage ? preferredImage : defaultImage)
      );
      // Returns the image
      return preferredImage ? preferredImage : defaultImage;
    } else {
      // Gets the image from storage if no data is available
      return JSON.parse(await AsyncStorage.getItem("user_image"));
    }
  });

  return image;
}

/**
 * Returns the user's dining info
 */
export async function getUserDining() {
  let diningData = get("dining");
  const dining = diningData.then(async (data) => {
    if (data) {
      // Saves the user's dining info to storage
      await AsyncStorage.setItem("user_dining", JSON.stringify(data));
      return data;
    } else {
      // Gets the dining info from storage if no data is available
      return JSON.parse(await AsyncStorage.getItem("user_dining"));
    }
  });

  return dining;
}

/**
 * Returns the user's schedule info
 */
export async function getUserSchedule() {
  let scheduleData = get("schedule");
  const schedule = scheduleData.then(async (data) => {
    if (data) {
      await AsyncStorage.setItem("user_schedule", JSON.stringify(data));
      return data;
    } else {
      return JSON.parse(await AsyncStorage.getItem("user_schedule"));
    }
  });

  return schedule;
}
