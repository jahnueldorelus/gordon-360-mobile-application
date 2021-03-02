import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "peopleSearchFilter",
  initialState: {
    filter: {
      filterNames: ["Academics", "Home", "Office"],
      selectedFilterIndex: 0, // Starts with Academics
      selectedFilterName: "Academics", // Starts with Academics
      selectedFilterSectionName: null,
    },
    academics: {
      major: {
        selected: null,
        filterName: "Major",
        data: [],
      },
      minor: {
        selected: null,
        filterName: "Minor",
        data: [],
      },
      class: {
        selected: null,
        filterName: "Class",
        data: [
          "Freshman",
          "Sophomore",
          "Junior",
          "Senior",
          "Graduate Student",
          "Undergraduate Conferred",
          "Graduate Conferred",
          "Unassigned",
        ],
      },
    },
    home: {
      city: { selected: null, filterName: "City" },
      state: {
        selected: null,
        filterName: "State",
        data: [],
      },
      country: {
        selected: null,
        filterName: "Country",
        data: [],
      },
    },
    office: {
      department: {
        selected: null,
        filterName: "Department",
        data: [],
      },
      dormitory: {
        selected: null,
        filterName: "Dormitory",
        data: [],
      },
    },
  },
  reducers: {
    /**
     * FILTER SECTION
     */
    // Saves the selected filter's index
    setSelectedFilterIndex: (state, action) => {
      state.filter.selectedFilterIndex = action.payload;
    },

    // Saves the selected filter's index
    setSelectedFilterName: (state, action) => {
      state.filter.selectedFilterName = action.payload;
    },

    // Saves the selected filter's selected section's name
    setSelectedFilterSectionName: (state, action) => {
      state.filter.selectedFilterSectionName = action.payload;
    },

    // Sets the selected item of a filter section
    setFilterSectionSelectedItem: (state, action) => {
      // Gets the selected item information
      const filterName = getNameForObjectParsing(action.payload.filterName);
      const sectionName = getNameForObjectParsing(action.payload.sectionName);
      const newSelectedItem = action.payload.selected;

      // Saves the new selected item
      state[filterName][sectionName].selected = newSelectedItem;
    },

    // Resets the selected item of a filter section
    resetFilterSectionSelected: (state, action) => {
      // Gets the selected item information
      const filterName = getNameForObjectParsing(action.payload.filterName);
      const sectionName = getNameForObjectParsing(action.payload.sectionName);
      // Saves the new selected item
      state[filterName][sectionName].selected = null;
    },

    /**
     * ACADEMICS SECTION
     */
    // Saves the majors list
    saveMajorsList: (state, action) => {
      state.academics.major.data = action.payload;
    },
    // Saves the minors list
    saveMinorsList: (state, action) => {
      state.academics.minor.data = action.payload;
    },

    /**
     * HOME SECTION
     */
    // Saves the states list
    saveStatesList: (state, action) => {
      state.home.state.data = action.payload;
    },
    // Saves the countries list
    saveCountryList: (state, action) => {
      state.home.country.data = action.payload;
    },

    /**
     * OFFICE SECTION
     */
    // Saves the department list
    saveDepartmentList: (state, action) => {
      state.office.department.data = action.payload;
    },
    // Saves the dormitory list
    saveDormitoryList: (state, action) => {
      state.office.dormitory.data = action.payload;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/

// Gets the selected filter's index in the lists of filters
export const getSelectedFilterIndex = createSelector(
  (state) => state.ui.peopleSearchFilter,
  (people) => people.filter.selectedFilterIndex
);

// Gets the list of filter names
export const getFilterNames = createSelector(
  (state) => state.ui.peopleSearchFilter,
  (people) => people.filter.filterNames
);

// Gets the selected filter's name
export const getSelectedFilterName = createSelector(
  (state) => state.ui.peopleSearchFilter,
  (people) => people.filter.selectedFilterName
);

// Gets the selected filter's selected section's name
export const getSelectedFilterSectionName = createSelector(
  (state) => state.ui.peopleSearchFilter,
  (people) => people.filter.selectedFilterSectionName
);

// Gets the selected filter's data object
export const getFilterObject = createSelector(
  (state) => state.ui.peopleSearchFilter,
  getSelectedFilterIndex,
  getFilterNames,
  (people, selectedFilterIndex, filterNames) =>
    people[getNameForObjectParsing(filterNames[selectedFilterIndex])]
);

// Gets the selected filter's selected section's data
export const getSelectedFilterSectionData = createSelector(
  getFilterObject,
  getSelectedFilterSectionName,
  (filterObject, filterSectionName) => {
    // Gets parsed section name for retrieveing data from state
    const sectionName = getNameForObjectParsing(filterSectionName);
    // Gets the section's data. Returns false if not found
    return filterObject &&
      sectionName &&
      filterObject[sectionName] &&
      filterObject[sectionName].data
      ? filterObject[sectionName].data
      : null;
  }
);

// Gets the selected filter's selected section's selected item
export const getSelectedFilterSectionItem = createSelector(
  getFilterObject,
  getSelectedFilterSectionName,
  (filterObject, filterSectionName) => {
    // Gets parsed section name for retrieveing data from state
    const sectionName = getNameForObjectParsing(filterSectionName);
    // Gets the section's data. Returns false if not found
    return filterObject &&
      sectionName &&
      filterObject[sectionName] &&
      filterObject[sectionName].selected
      ? filterObject[sectionName].selected
      : null;
  }
);

/**
 * Gets all the selected items for each filter section
 * @param {Object} state The redux's store's state
 */
export const getSelectedItemsAndNames = (state) => {
  // The peopleSearch ui state
  const peopleSearch = state.ui.peopleSearchFilter;
  // The selected items of each filter section and selected section names
  let selected = {
    items: {},
    names: [],
  };
  // Gets the names of each filter to parse through each section
  const filterNames = getFilterNames(state);

  // Corrects the section name for the back-end to parse correctly
  const correctSectionName = (oldSectionName) => {
    // The section name
    let newSectionName;
    // Sets the correct section property name
    switch (oldSectionName) {
      case "Class":
        newSectionName = "classType";
        break;
      case "City":
        newSectionName = "homeCity";
        break;
      case "Dormitory":
        newSectionName = "building";
        break;
      default:
        newSectionName = oldSectionName.toLowerCase();
    }

    return newSectionName;
  };

  // Iterates throuch each filter type
  filterNames.forEach((name) => {
    // Gets the filter's section data
    const filterObject = peopleSearch[name.toLowerCase()];
    // Iterates through the filter's sections to retrieve the selected items
    Object.values(filterObject).forEach((section) => {
      // Saves the section's selected item
      selected.items[correctSectionName(section.filterName)] = section.selected
        ? section.selected
        : "";
      // Saves the section's name if the section has a selected item
      if (section.selected) selected.names.push(section.filterName);
    });
  });

  return selected;
};

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the selected filter's index and filter name.
 * @param {number} index The button index of the filter
 */
export const setSelectedFilterIndex = (index) => (dispatch, getState) => {
  // Sets the selected filter's index
  dispatch({ type: slice.actions.setSelectedFilterIndex.type, payload: index });
  // Sets the selected filter's name
  dispatch({
    type: slice.actions.setSelectedFilterName.type,
    payload: getFilterNames(getState())[index],
  });
  // Resets the selected section name
  dispatch({
    type: slice.actions.setSelectedFilterSectionName.type,
    payload: null,
  });
};

/**
 * Sets the selected filter's section.
 * @param {string} sectionName The name of the section of the filter
 */
export const setSelectedFilterSectionName = (sectionName) => (
  dispatch,
  getState
) => {
  dispatch({
    type: slice.actions.setSelectedFilterSectionName.type,
    payload: sectionName,
  });
};

/**
 * Sets the selected item for a filter section
 * @param {string} filterName The name of the filter
 * @param {string} sectionName The name of the section of the filter
 * @param {string} selected The selected item of the filter's section
 */
export const setSelectedFilterSectionItem = (
  filterName,
  sectionName,
  selected
) => (dispatch, getState) => {
  dispatch({
    type: slice.actions.setFilterSectionSelectedItem.type,
    payload: { filterName, sectionName, selected },
  });
};

/**
 * Resets the selected item for a filter section
 * @param {string} filterName The name of the filter
 * @param {string} sectionName The name of the section of the filter
 */
export const resetSelectedFilterSectionItem = (filterName, sectionName) => (
  dispatch,
  getState
) => {
  dispatch({
    type: slice.actions.resetFilterSectionSelected.type,
    payload: { filterName, sectionName },
  });
};

/**
 * Fetches all data needed for each filter option
 */
export const fetchFilterData = (dispatch, getState) => {
  // Gets the list of majors
  dispatch(
    apiRequested({
      url: "/advanced-search/majors",
      useEndpoint: true,
      onSuccess: slice.actions.saveMajorsList.type,
    })
  );
  // Gets the list of minors
  dispatch(
    apiRequested({
      url: "/advanced-search/minors",
      useEndpoint: true,
      onSuccess: slice.actions.saveMinorsList.type,
    })
  );
  // Gets the list of states in the USA
  dispatch(
    apiRequested({
      url: "/advanced-search/states",
      useEndpoint: true,
      onSuccess: slice.actions.saveStatesList.type,
    })
  );
  // Gets the list of countries
  dispatch(
    apiRequested({
      url: "/advanced-search/countries",
      useEndpoint: true,
      onSuccess: slice.actions.saveCountryList.type,
    })
  );
  // Gets the list of departments
  dispatch(
    apiRequested({
      url: "/advanced-search/departments",
      useEndpoint: true,
      onSuccess: slice.actions.saveDepartmentList.type,
    })
  );
  // Gets the list of dormitories
  dispatch(
    apiRequested({
      url: "/advanced-search/halls",
      useEndpoint: true,
      onSuccess: slice.actions.saveDormitoryList.type,
    })
  );
};

/*********************************** HELPER FUNCTIONS ***********************************/
/**
 * Takes a filter or section name and returns a lowercased version
 * in order for its data to be accessed dynamically in the state
 */
const getNameForObjectParsing = (name) => {
  return name ? name.toLowerCase() : null;
};
