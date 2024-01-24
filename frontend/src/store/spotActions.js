import { csrfFetch } from './csrf';
import { addSpot } from './spotsReducer';


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
