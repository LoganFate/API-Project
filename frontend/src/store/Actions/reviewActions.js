// reviewActions.js
import { csrfFetch } from '../csrf';

// Action types
export const ADD_REVIEW = 'reviews/ADD_REVIEW';
export const SET_REVIEWS = 'reviews/SET_REVIEWS';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

export const deleteReview = (reviewId) => async dispatch => {
  try {
    await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    dispatch({
      type: DELETE_REVIEW,
      payload: reviewId,
    });
  } catch (error) {
    console.error('Error deleting review', error)
  }
};

export const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
});

export const fetchReviews = (spotId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await response.json();
        // Sort reviews by createdAt in descending order
        const sortedReviews = reviewsData.Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch(setReviews(sortedReviews));
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};


export const addReview = (spotId, reviewData) => async dispatch => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error submitting review');
      }

      const newReview = await response.json();
      dispatch({
        type: ADD_REVIEW,
        payload: newReview,
      });

      return newReview;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error; // Re-throw to handle it in the calling component
    }
  };

  export default {
    addReview,
    fetchReviews,
  };
