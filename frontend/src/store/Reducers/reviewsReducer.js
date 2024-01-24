// reviewsReducer.js
import { ADD_REVIEW, SET_REVIEWS, DELETE_REVIEW } from '../Actions/reviewActions';

const initialState = {
  // Your initial state
  reviews: [],
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REVIEW:
      return {
        ...state,
        // Add the new review to the top of the list
        reviews: [action.payload, ...state.reviews],
      };
      case SET_REVIEWS:
        return {
            ...state,
            reviews: action.payload
        }
        case DELETE_REVIEW:
          return {
            ...state,
            reviews: state.reviews.filter(review => review.id !== action.payload),
          };
    default:
      return state;
  }
};

export default reviewsReducer;
