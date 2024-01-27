import { csrfFetch } from '../csrf';


export const ADD_SPOT = 'spots/ADD_SPOT';
export const FETCH_SPOT_DETAILS = 'spots/FETCH_SPOT_DETAILS';
export const SET_USER_SPOTS = 'spots/SET_USER_SPOTS'
export const DELETE_SPOT = 'spots/DELETE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';


export const updateSpotDetails = (spotId, updatedDetails) => async dispatch => {
  // Optionally, you can also update the backend here if needed
  dispatch({
      type: UPDATE_SPOT,
      payload: updatedDetails,
  });
};

export const updateSpot = (spotId, spotData) => async dispatch => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating spot');
    }

    const updatedSpot = await response.json();
    dispatch({
      type: UPDATE_SPOT,
      payload: updatedSpot,
    });
    return updatedSpot;
  } catch (error) {
    console.error('Error updating spot:', error);
    throw error; // Re-throw to handle it in the calling component
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      dispatch({
        type: DELETE_SPOT,
        payload: spotId
      });
    }
  } catch (error) {
    console.error('Error deleting spot:', error);
    // Handle error appropriately
  }
};

export const setUserSpots = (spots) => {
  return {
      type: SET_USER_SPOTS,
      payload: spots,
  };
};

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

export const setSpotDetails = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS,
  payload: spotDetails,
});


export const createSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch(addSpot(newSpot));
      return { spot: newSpot };
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (networkError) {
    console.error('Network error:', networkError);
    return { error: { message: "Network error, failed to create spot" } };
  }
};




export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch spot details');
    }
    const spotDetails = await response.json();
    dispatch(setSpotDetails(spotDetails));
  } catch (error) {
    console.error('Error fetching spot details:', error);
  }
};

export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  if (response.ok) {
      const { Spots } = await response.json();
      dispatch(setUserSpots(Spots));
  }
};


export default {
  createSpot,
  fetchSpotDetails,
  setUserSpots,
  fetchUserSpots,
};
