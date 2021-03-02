import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "peopleSearch",
  initialState: {
    data: {},
    loading: false,
  },
  reducers: {
    // Adds the result of the people search
    personAdded: (state, action) => {
      // If there are people in the result list
      if (action.payload !== []) {
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
      }
    },

    // Resets the people search results
    peopleSearchReset: (state, action) => {
      state.data = {};
    },

    // People Search request started
    peopleReqStarted: (state, action) => {
      state.loading = true;
    },

    // People Search request ended
    peopleReqEnded: (state, action) => {
      state.loading = false;
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
      onSuccess: slice.actions.personAdded.type,
      onStart: slice.actions.peopleReqStarted.type,
      onEnd: slice.actions.peopleReqEnded.type,
    })
  );
};

/**
 * Resets the people search results
 */
export const resetSearchList = () => (dispatch, getState) => {
  dispatch({ type: slice.actions.peopleSearchReset.type });
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
