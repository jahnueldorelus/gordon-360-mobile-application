import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";
import { Promise } from "bluebird";
import axios from "axios";
import {
  getToken,
  getAPI,
  getAPIEndpoint,
} from "../entities/Auth/authSelectors";
import { type } from "jquery";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "peopleSearch",
  initialState: {
    data: {},
    loading: false,
    peopleSearchImages: {},
    peopleSearchImageRequests: {},
  },
  reducers: {
    /**
     * PEOPLE SEARCH REDUCERS
     */
    // Adds the result of the people search
    peopleAdded: (state, action) => {
      /**
       * If there are people in the result list
       * The comparison must be done with stringified version as JS recognizes
       * the action.payload as an object
       */
      if (JSON.stringify(action.payload) !== JSON.stringify([])) {
        let newSearchListObj = {};
        action.payload.forEach((person) => {
          // Only saves the users who have not graduated and are still students
          if (
            person.Class &&
            ["0", "1", "2", "3", "4", "5"].includes(person.Class)
          )
            newSearchListObj[person.AD_Username] = person;
          // Faculty and staff are also saved since they don't have a class
          else if (!person.Class) newSearchListObj[person.AD_Username] = person;
        });

        // Saves the new search list object
        state.data = newSearchListObj;
      }
      // If there are no people in the result list
      else {
        state.data = {};
        state.loading = false;
      }
      // Resets the list of searched images and images requested
      state.peopleSearchImages = {};
      state.peopleSearchImageRequests = {};
    },

    peopleImagesAdded: (state, action) => {
      action.payload.forEach((person) => {
        // Gets the person's image and username
        const { def, pref, username } = person;
        // Does a check to make sure all properties are available
        if ((def || pref) && username) {
          // Saves the person's image if available
          state.peopleSearchImages[username] = pref
            ? // Saves the preferred image if available
              "data:image/png;base64," + pref
            : def
            ? // Saves the default image if preferred image is unavailable
              "data:image/png;base64," + def
            : // Saves nothing if no image is available
              null;
        }
      });

      /**
       * If the first item isn't false (the list has retrieved user images) or if the length of
       * the list is 0 (there's no users in the search result), then the search request has ended
       */
      if (
        (action.payload.length > 0 && action.payload[0] !== false) ||
        action.payload.length === 0
      )
        state.loading = false;
    },

    personImageRequestAdded: (state, action) => {
      action.payload.searchResultList.forEach((person) => {
        if (!state.peopleSearchImageRequests[person])
          state.peopleSearchImageRequests[person] = person;
      });
    },

    // Resets the people search results
    peopleSearchReset: (state, action) => {
      state.data = {};
    },

    // People Search request started
    peopleReqStarted: (state, action) => {
      state.loading = true;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.data = {};
      state.loading = false;
      state.peopleSearchImageRequests = {};
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/
/**
 * Returns the result of the people search
 */
export const getPeopleSearchResults = createSelector(
  (state) => state.ui.peopleSearch,
  (peopleSearch) => Object.values(peopleSearch.data)
);

/**
 * Returns the people search's loading status
 */
export const getPeopleSearchLoading = createSelector(
  (state) => state.ui.peopleSearch,
  (peopleSearch) => peopleSearch.loading
);

/**
 * Returns the people who's image has already been requested
 */
const getPeopleWithImageRequested = createSelector(
  (state) => state.ui.peopleSearch,
  (peopleSearch) => peopleSearch.peopleSearchImageRequests
);

/**
 * Returns the object of the searched result images
 */
export const getSearchResultImages = createSelector(
  (state) => state.ui.peopleSearch,
  (peopleSearch) => peopleSearch.peopleSearchImages
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * The search parameters for searching on People Search
 * @param {Object} searchParams Contains the search parameters
 */
export const searchForPeople = (searchParams) => (dispatch, getState) => {
  const {
    includeAlumni,
    firstName,
    lastName,
    major,
    minor,
    hall,
    classType,
    homeCity,
    state,
    country,
    department,
    building,
  } = correctSearchParams(searchParams);

  dispatch(
    apiRequested({
      url: `/accounts/advanced-people-search/${includeAlumni}/${firstName}/${lastName}/${major}/${minor}/${hall}/${classType}/${homeCity}/${state}/${country}/${department}/${building}`,
      method: "get",
      useEndpoint: true,
      onSuccess: slice.actions.peopleAdded.type,
      onStart: slice.actions.peopleReqStarted.type,
    })
  );
};

/**
 * Fetches the user's image based on their username.
 * The fetch is done here and not through the middleware "api.js" due to
 * concurrency issues. If the list of people contain more than 500 people, this
 * will cause an error as there's a maximum limit of 500 callbacks. Therefore,
 * the fetch is used here in order to use Bluebird which helps control the
 * concurrency of each fetch to prevent the 'excessive number of callbacks' error
 * from occuring. The maximum amount of pending requests made at a time is 350
 *
 * @param {Array} listOfPeople The list of people to retrieve the image of
 */
export const fetchPeoplesImage = (listOfPeople) => (dispatch, getState) => {
  // Object of people who's image has already been requested
  const peopleWithRequest = getPeopleWithImageRequested(getState());

  // Saves the name of every person to prevent a re-fetch from occuring
  dispatch({
    type: slice.actions.personImageRequestAdded.type,
    payload: { searchResultList: listOfPeople },
  });

  const peoplesImages = Promise.map(
    listOfPeople,
    async (person) => {
      if (!peopleWithRequest[person]) {
        // Does the request for the person's image
        return await axios({
          baseURL: getAPI(getState()),
          url: getAPIEndpoint(getState()) + `/profiles/Image/${person}/`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken(getState())}`,
            "Content-Type": "application/json",
          },
        })
          // Returns a response with the name of the person associated with the request
          .then((response) => {
            return { ...response.data, username: person };
          });
      } else {
        return false; // Returns an empty object
      }
    },
    // Creates a limit of 350 pending requests at a time
    { concurrency: 350 }
  );

  // Saves the list of user images and sets the search loading to false
  peoplesImages.then((results) => {
    dispatch({ type: slice.actions.peopleImagesAdded.type, payload: results });
  });
};

/**
 * Resets the people search results
 */
export const resetSearchList = (dispatch, getState) => {
  dispatch({ type: slice.actions.peopleSearchReset.type });
};

/**
 * Resets all the state's data
 */
export const ui_PeopleSearchResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};

/*********************************** HELPER FUNCTIONS ***********************************/
/**
 * Search for (AKA GoStalk) a person/people based on the following queried parameters
 * The values given are converted since the back-end can't handle &, /, -, or null/empty strings
 * @returns {Object} The corrected search parameters
 */
const correctSearchParams = ({
  includeAlumni,
  firstName,
  lastName,
  major,
  minor,
  hall,
  classType,
  homeCity,
  state,
  country,
  department,
  building,
}) => {
  // Null value that the back-end can parse
  const nullParam = "C" + "\u266F";

  // Converts the text in a way that the back-end can parse
  const convertText = (text) =>
    text
      .trim()
      .replace(/[^a-zA-Z\s,.'-]/g, "")
      .toLowerCase();

  /**
   * Converts the first name parameter
   */
  firstName = firstName ? convertText(firstName) : nullParam;

  /**
   * Converts the last name parameter
   */
  lastName = lastName ? convertText(lastName) : nullParam;

  /**
   * Converts the major parameter
   */
  if (major) {
    major = major.replace("&", "_");
    major = major.replace("-", "dash");
    major = major.replace(":", "colon");
    major = major.replace("/", "slash");
  } else {
    major = nullParam;
  }

  /**
   * Converts the minor parameter
   */
  minor = minor ? minor.replace("&", "_") : nullParam;

  /**
   * Converts the hall parameter
   * The dorm hall that a student lives in
   */
  hall = hall ? hall.trim() : nullParam;

  /**
   * Converts the class type parameter
   */
  switch (classType) {
    case "Unassigned":
      classType = 0;
      break;
    case "Freshman":
      classType = 1;
      break;
    case "Sophomore":
      classType = 2;
      break;
    case "Junior":
      classType = 3;
      break;
    case "Senior":
      classType = 4;
      break;
    case "Graduate Student":
      classType = 5;
      break;
    case "Undegraduate Conferred":
      classType = 6;
      break;
    case "Graduate Conferred":
      classType = 7;
      break;
    default:
      classType = nullParam;
  }

  /**
   * Converts the home city parameter
   */
  homeCity = homeCity ? convertText(homeCity) : nullParam;

  /**
   * Converts the state parameter
   * A US state or a Canadian Province
   */
  if (!state) state = nullParam;

  /**
   * Converts the country parameter
   */
  if (!country) country = nullParam;

  /**
   * Converts the department parameter
   * The department where faculty/staff work
   */
  department = department ? department.replace("&", "_") : nullParam;

  /**
   * Converts the building parameter
   * The building where faculty/staff work
   */
  building = building ? building.replace(".", "_") : nullParam;

  return {
    includeAlumni,
    firstName,
    lastName,
    major,
    minor,
    hall,
    classType,
    homeCity,
    state,
    country,
    department,
    building,
  };
};
