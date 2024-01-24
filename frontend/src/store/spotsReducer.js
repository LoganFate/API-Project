const ADD_SPOT = 'spots/ADD_SPOT';


export const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});


const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_SPOT:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    default:
      return state;
  }
};

export default spotsReducer;
