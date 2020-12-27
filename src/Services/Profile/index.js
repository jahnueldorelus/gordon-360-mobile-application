import AsyncStorage from "@react-native-community/async-storage";
import { get } from "../HTTP";

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

/**
 * Returns the user's involvements info
 * @param user_id The id of the current user
 */
export async function getUserInvolvements(user_id) {
  /**
   * Checks to see if the user's id is available. If not, then data is returned
   * from storage
   */
  if (user_id) {
    let membershipData = get(`memberships/student/${user_id}`);
    const memberships = membershipData.then(async (data) => {
      if (data) {
        await AsyncStorage.setItem("user_memberships", JSON.stringify(data));
        return data;
      } else {
        return JSON.parse(await AsyncStorage.getItem("user_memberships"));
      }
    });
    return memberships;
  } else {
    return JSON.parse(await AsyncStorage.getItem("user_memberships"));
  }
}

/**
 * Returns the user's chapel info
 */
export async function getUserChapelInfo() {
  let chapelData = get(`events/chapel/${getTermCode()}`);
  const chapel = chapelData.then(async (data) => {
    if (data) {
      // Gets required number of CL&W credits for the user, defaulting to thirty
      let required = 30;
      if (data.length > 0) {
        [{ Required: required }] = data;
      }
      // Chapel info
      let chapelInfo = {
        current: data.length || 0,
        required,
      };

      await AsyncStorage.setItem("user_chapel", JSON.stringify(chapelInfo));
      return chapelInfo;
    } else {
      return JSON.parse(await AsyncStorage.getItem("user_chapel"));
    }
  });
  return chapel;
}

/**
 * Gets the current term code. (Code was taken from repo "gordon-360-ui")
 */
function getTermCode() {
  const now = new Date();
  const terms = {
    spring: "SP",
    fall: "FA",
  };

  // Decide what term it is, defaulting to fall
  let term = terms.fall;
  let year = now.getFullYear();
  if (now.getMonth() <= 6) {
    term = terms.spring;
    // If spring term, decrement current year to get current academic year
    year -= 1;
  }

  return `${year.toString().substr(-2)}${term}`;
}
