import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";
import { apiRequested } from "../middleware/api";

/*********************************** SLICE ***********************************/
const template = { data: null, lastFetch: null, loading: false };
const slice = createSlice({
  name: "profile",
  initialState: {
    image: { ...template },
    dining: { ...template },
    chapel: { ...template },
    involvements: { ...template },
    userInfo: { ...template },
    schedule: { ...template },
    advisors: { ...template },
  },
  reducers: {
    /**
     * IMAGE REDUCERS
     */
    // Adds the user image's
    imageAdded: ({ image }, action) => {
      image.data = getImageData(action.payload);
      image.lastFetch = Date.now();
    },

    // User's image request started
    imageReqStarted: ({ image }, action) => {
      image.loading = true;
    },

    // User's image request ended
    imageReqEnded: ({ image }, action) => {
      image.loading = false;
    },

    /**
     * DINING REDUCERS
     */
    // Adds the user dining info
    diningAdded: ({ dining }, action) => {
      dining.data = getDiningData(action.payload);
      dining.lastFetch = Date.now();
    },

    // User's dining request started
    diningReqStarted: ({ dining }, action) => {
      dining.loading = true;
    },

    // User's dining request ended
    diningReqEnded: ({ dining }, action) => {
      dining.loading = false;
    },

    /**
     * CHAPEL REDUCERS
     */
    // Adds the user chapel info
    chapelAdded: ({ chapel }, action) => {
      chapel.data = action.payload;
      chapel.lastFetch = Date.now();
    },

    // User's chapel request started
    chapelReqStarted: ({ chapel }, action) => {
      chapel.loading = true;
    },

    // User's chapel request ended
    chapelReqEnded: ({ chapel }, action) => {
      chapel.loading = false;
    },

    /**
     * INVOLVEMENTS REDUCERS
     */
    // Adds the user involvements
    involvementAdded: ({ involvements }, action) => {
      involvements.data = action.payload;
      involvements.lastFetch = Date.now();
    },

    // User's involvements request started
    involReqStarted: ({ involvements }, action) => {
      involvements.loading = true;
    },

    // User's involvements request ended
    involReqEnded: ({ involvements }, action) => {
      involvements.loading = false;
    },

    /**
     * PROFILE INFO REDUCERS
     */
    // Adds the user info
    infoAdded: ({ userInfo }, action) => {
      userInfo.data = action.payload;
      userInfo.lastFetch = Date.now();
    },

    // User's info request started
    infoReqStarted: ({ userInfo }, action) => {
      userInfo.loading = true;
    },

    // User's info request ended
    infoReqEnded: ({ userInfo }, action) => {
      userInfo.loading = false;
    },

    /**
     * ADVISOR(S) REDUCERS
     */
    // Adds the user advisor(s)
    advisorsAdded: ({ advisors }, action) => {
      advisors.data = action.payload;
      advisors.lastFetch = Date.now();
    },

    // User's advisor(s) request started
    advisorsReqStarted: ({ advisors }, action) => {
      advisors.loading = true;
    },

    // User's advisor(s) request ended
    advisorsReqEnded: ({ advisors }, action) => {
      advisors.loading = false;
    },

    /**
     * SCHEDULE REDUCERS
     */
    // Adds the user schedule
    scheduleAdded: ({ schedule }, action) => {
      schedule.data = action.payload;
      schedule.lastFetch = Date.now();
    },

    // User's schedule request started
    schedReqStarted: ({ schedule }, action) => {
      schedule.loading = true;
    },

    // User's schedule request ended
    schedReqEnded: ({ schedule }, action) => {
      schedule.loading = false;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.image = { ...template };
      state.dining = { ...template };
      state.chapel = { ...template };
      state.involvements = { ...template };
      state.userInfo = { ...template };
      state.schedule = { ...template };
      state.advisors = { ...template };
    },

    // Resets all the state's data except for their profile info
    resetStateExceptUserProfile: (state, action) => {
      state.image = { ...template };
      state.dining = { ...template };
      state.chapel = { ...template };
      state.involvements = { ...template };
      state.schedule = { ...template };
      state.advisors = { ...template };
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/
/**
 * Returns the user's image
 */
export const getUserImage = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.image.data
);

/**
 * Returns the user's image request pending status
 */
export const getReqUserImageStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.image.loading
);

/**
 * Returns the user's dining info
 */
export const getUserDining = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.dining.data
);

/**
 * Returns the user's dining request pending status
 */
export const getReqUserDiningStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.dining.loading
);

/**
 * Returns the user's chapel info
 */
export const getUserChapel = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.chapel.data
);

/**
 * Returns the user's chapel request pending status
 */
export const getReqUserChapelStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.chapel.loading
);

/**
 * Returns the user's involvements
 */
export const getUserInvolvements = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.involvements.data
);

/**
 * Returns the user's involvements request pending status
 */
export const getReqUserInvolvementsStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.involvements.loading
);

/**
 * Returns the user's profile info
 */
export const getUserInfo = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.userInfo.data
);

/**
 * Returns the user's profile request pending status
 */
export const getReqUserProfileStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.userInfo.loading
);

/**
 * Returns the user's schedule info
 */
export const getUserSchedule = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.schedule.data
);

/**
 * Returns the user's schedule request pending status
 */
export const getReqUserScheduleStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.schedule.loading
);

/**
 * Returns the user's advisor(s)
 */
export const getUserAdvisors = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.advisors.data
);

/**
 * Returns the user's advisors request pending status
 */
export const getReqUserAdvisorsStatus = createSelector(
  (state) => state.entities.profile,
  (profile) => profile.advisors.loading
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * Fetches the user's profile info
 * @returns An action of fetching the user's profile info
 */
export const fetchProfile = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/profiles",
      useEndpoint: true,
      onStart: slice.actions.infoReqStarted.type,
      onSuccess: slice.actions.infoAdded.type,
      onEnd: slice.actions.infoReqEnded.type,
    })
  );
};

/**
 * Fetches the user's image
 * @returns An action of fetching the user's image
 */
export const fetchImage = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/profiles/image",
      useEndpoint: true,
      onStart: slice.actions.imageReqStarted.type,
      onSuccess: slice.actions.imageAdded.type,
      onEnd: slice.actions.imageReqEnded.type,
    })
  );
};

/**
 * Fetches the user's dining info
 * @returns An action of fetching the user's dining info
 */
export const fetchDining = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/dining",
      useEndpoint: true,
      onStart: slice.actions.diningReqStarted.type,
      onSuccess: slice.actions.diningAdded.type,
      onEnd: slice.actions.diningReqEnded.type,
    })
  );
};

/**
 * Fetches the user's schedule
 * @returns An action of fetching the user's schedule
 */
export const fetchSchedule = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/schedule",
      useEndpoint: true,
      onStart: slice.actions.schedReqStarted.type,
      onSuccess: slice.actions.scheduleAdded.type,
      onEnd: slice.actions.schedReqEnded.type,
    })
  );
};

/**
 * Fetches the user's involvements
 * @returns An action of fetching the user's involvements
 */
export const fetchInvolvements = (dispatch, getState) => {
  // The user's ID number
  const userID = getUserInfo(getState()).ID;

  dispatch(
    apiRequested({
      url: `/memberships/student/${userID}`,
      useEndpoint: true,
      onStart: slice.actions.involReqStarted.type,
      onSuccess: slice.actions.involvementAdded.type,
      onEnd: slice.actions.involReqEnded.type,
    })
  );
};

/**
 * Fetches the user's chapel info
 * @returns An action of fetching the user's chapel info
 */
export const fetchChapel = (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: `/events/chapel/${getTermCode()}`,
      useEndpoint: true,
      onStart: slice.actions.chapelReqStarted.type,
      onSuccess: slice.actions.chapelAdded.type,
      onEnd: slice.actions.chapelReqEnded.type,
    })
  );
};

/**
 * Fetches the user's advisor(s)
 * @param {string} username The user's username (firstname.lastname)
 * @returns An action of fetching the user's advisor(s)
 */
export const fetchAdvisors = (dispatch, getState) => {
  // The user's username
  const username = getUserInfo(getState()).AD_Username;

  dispatch(
    apiRequested({
      url: `/profiles/Advisors/${username}/`,
      useEndpoint: true,
      onStart: slice.actions.advisorsReqStarted.type,
      onSuccess: slice.actions.advisorsAdded.type,
      onEnd: slice.actions.advisorsReqEnded.type,
    })
  );
};

/**
 * Resets all the state's data except for the user's profile info
 */
export const ent_ProfileResetExceptUserProfile = (dispatch, getState) => {
  dispatch({
    type: slice.actions.resetStateExceptUserProfile.type,
    payload: null,
  });
};

/**
 * Fetches all data used by this slice from the server
 */
export const ent_ProfileFetchAllData = (dispatch, getState) => {
  dispatch(fetchAdvisors);
  dispatch(fetchChapel);
  dispatch(fetchDining);
  dispatch(fetchImage);
  dispatch(fetchInvolvements);
  dispatch(fetchProfile);
  dispatch(fetchSchedule);
};

/**
 * Resets all the state's data
 */
export const ent_ProfileResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};

/*********************************** HELPER FUNCTIONS ***********************************/

/**
 * Gets the current term code. (Code was taken from repo "gordon-360-ui")
 * @returns {String} The term code as either "SP" (Spring) or "FA" (Fall)
 */
const getTermCode = () => {
  const now = new Date();
  const terms = {
    spring: "SP",
    fall: "FA",
  };
  // Decides what term it is, defaulting to fall
  let term = terms.fall;
  let year = now.getFullYear();
  if (now.getMonth() <= 6) {
    term = terms.spring;
    // If spring term, decrement current year to get current academic year
    year -= 1;
  }
  return `${year.toString().substr(-2)}${term}`;
};

/**
 * Extracts the user's image
 * @param {Object} data The user's image object
 * @returns {String} The base64 image string of the user
 */
const getImageData = (data) => {
  /**
   * Gets the default and preferred images. There's only one or the other.
   * Either a preferred and no default or vice versa
   */
  const { def: defaultImage, pref: preferredImage } = data;
  return preferredImage ? preferredImage : defaultImage;
};

/**
 * Extracts the user's dining data
 * @param {Object} data The user's dining object
 * @returns {Object} The user's dining info
 */
const getDiningData = (data) => {
  // Creates a new dining object to be saved in the store
  let diningData = {};
  // If there's data, then the user has a dining plan. Otherwise, they have no plan
  if (data && data.Swipes && data.DiningDollars && data.GuestSwipes) {
    // Creates the user's dining data. If the current balance is null, then the user has no balance
    diningData.swipes = data.Swipes.CurrentBalance
      ? data.Swipes.CurrentBalance
      : 0;
    diningData.dollars = data.DiningDollars.CurrentBalance
      ? data.DiningDollars.CurrentBalance
      : 0;
    diningData.guestSwipes = data.GuestSwipes.CurrentBalance
      ? data.GuestSwipes.CurrentBalance
      : 0;
  } else {
    // Creates the user's dining data with each balance set to 0 since there's no dining plan
    diningData.swipes = 0;
    diningData.dollars = 0;
    diningData.guestSwipes = 0;
  }
  return diningData;
};
