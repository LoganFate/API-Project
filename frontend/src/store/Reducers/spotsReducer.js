import { SET_USER_SPOTS, DELETE_SPOT, UPDATE_SPOT } from '../Actions/spotActions';

const ADD_SPOT = 'spots/ADD_SPOT';
const FETCH_SPOT_DETAILS = 'spots/FETCH_SPOT_DETAILS';

// Action creators
export const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

export const setSpotDetails = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS,
  payload: spotDetails,
});

const initialState = {
  currentSpot: null, // To store details of a single spot
  allSpots: {}, // Assuming you want to keep track of all spots
  userSpots: [],
  // ... other state properties
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
      };
    case FETCH_SPOT_DETAILS:
      return {
        ...state,
        currentSpot: action.payload,
      };
      case SET_USER_SPOTS:
            return {
                ...state,
                userSpots: action.payload,
            };
            case DELETE_SPOT: {
              const updatedUserSpots = state.userSpots.filter(spot => spot.id !== action.payload);
              return {
                ...state,
                userSpots: updatedUserSpots
              };
            }
            case UPDATE_SPOT:
              return {
                  ...state,
                  allSpots: {
                      ...state.allSpots,
                      [action.payload.id]: action.payload,
                  },
                  currentSpot: action.payload.id === state.currentSpot?.id ? action.payload : state.currentSpot,
              };
    default:
      return state;
  }
};

export default spotsReducer;
