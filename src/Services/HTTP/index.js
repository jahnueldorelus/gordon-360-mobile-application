import AsyncStorage from "@react-native-community/async-storage";

const apiSource = "https://360apitrain.gordon.edu/api/";

/**
 * Does a GET to the API. If the user is not authenticated, then the request
 * automatically fails.
 *
 * @param url The URL of the request
 * @returns Response if available, otherwise false if the request failed
 */
export async function get(url) {
  // If the request is authenticated
  if (isAuthenticated()) {
    const data = await fetch(apiSource + url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(
          await AsyncStorage.getItem("token")
        )}`,
        "Content-Type": "application/json",
      },
    })
      // If a response was returned
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      // If the fetch failed
      .catch((error) => {
        return false;
      });

    return data;
  }
  // If the request isn't authenticated
  else return false;
}

/**
 * Does a PUT to the API. If the user is not authenticated, then the request
 * automatically fails.
 *
 * @param url The URL of the request
 * @param body The data to send along with the request
 * @returns Response if available, otherwise an error if the fetch failed
 */
export async function put(url, body) {
  // If the request is authenticated
  if (isAuthenticated()) {
    const data = await fetch(apiSource + url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.parse(
          await AsyncStorage.getItem("token")
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      // If a response was returned
      .then(async (response) => {
        // Parses the response to access data
        return await response.json();
      })
      // If the fetch failed
      .catch((error) => {
        return error;
      });

    return data;
  }
  // If the request isn't authenticated
  else return false;
}

/**
 * Checks to see if a token is saved in storage
 * @returns A boolean determining if a token is available
 */
async function isAuthenticated() {
  const token = JSON.parse(await AsyncStorage.getItem("token"));
  return token && token.length > 0 ? true : false;
}
