import { csrfFetch } from '../csrf';


export const ADD_SPOT = 'spots/ADD_SPOT';
export const FETCH_SPOT_DETAILS = 'spots/FETCH_SPOT_DETAILS';
export const SET_USER_SPOTS = 'spots/SET_USER_SPOTS'

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
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spotData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating spot');
  }

  const newSpot = await response.json();
  dispatch(addSpot(newSpot));
  return newSpot;
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
