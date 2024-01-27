import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReviewForm from '../ReviewForm/ReviewForm';
import { useModal } from '../../context/Modal';
import { addReview, fetchReviews, deleteReview, setReviews } from '../../store/Actions/reviewActions';
import { fetchSpotDetails, updateSpotDetails } from '../../store/Actions/spotActions';
import DeleteReviewModal from './DeleteReviewModal';
import './SpotDetailPage.css';

const ReadOnlyStarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <span key={index}
                        className="star"
                        style={{ color: ratingValue <= rating ? "#ffc107" : "#e4e5e9" }}
                    >&#9733;</span>
                );
            })}
        </div>
    );
};


const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent } = useModal();

    const spot = useSelector(state => state.spots.currentSpot);
    const reviews = useSelector(state => state.reviews.reviews);
    const sessionUser = useSelector(state => state.session.user);
    const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId)); // Fetch spot details from Redux action
    dispatch(fetchReviews(spotId)); // Fetch reviews from Redux action
  }, [dispatch, spotId, sessionUser?.id]);

const handleConfirmDeleteReview = async () => {
    await dispatch(deleteReview(selectedReviewId));
    setShowDeleteReviewModal(false);
    // Refetch reviews to update the list
    dispatch(fetchReviews(spotId));
};


const handleCancelDeleteReview = () => {
    setShowDeleteReviewModal(false);
};

const handleReviewSubmission = async (reviewData) => {
    try {
      const newReview = await dispatch(addReview(spotId, reviewData));
      setModalContent(null);

      // Update the reviews in Redux state
      const updatedReviews = [newReview, ...reviews];
      dispatch(setReviews(updatedReviews));

      // Update the spot details (e.g., avg rating, total reviews)
      const newAvgRating = calculateNewAverage(updatedReviews);
      const newReviewCount = updatedReviews.length;
      dispatch(updateSpotDetails({ ...spot, avgStarRating: newAvgRating, numReviews: newReviewCount }));
    } catch (error) {
      console.error('Error submitting review:', error);
    }
};
const calculateNewAverage = (reviews) => {
    const total = reviews.reduce((acc, review) => acc + review.stars, 0);
    return total / reviews.length;
};

  if (!spot) {
    return <div>Loading...</div>;
  }

const mainImageUrl = spot.SpotImages && spot.SpotImages.length > 0
    ? spot.SpotImages[0].url
    : spot.mainImageUrl;
const otherImages = spot.SpotImages.slice(1).map(image => image.url);

const displayRating = spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)}` : "New";
const reviewCount = spot.numReviews || 0;

let reviewText = reviewCount > 0
    ? reviewCount === 1 ? ` · 1 Review` : ` · ${reviewCount} Reviews`
    : '';

const handleReserveClick = () => {
    alert("Feature coming soon");
};

const handlePostReviewClick = () => {
    setModalContent( <ReviewForm
        spotId={parseInt(spotId)}
        userId={sessionUser.id}
        onSubmit={handleReviewSubmission}
        closeModal={() => setModalContent(null)}
    />
    );
};

const handleOpenDeleteReviewModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowDeleteReviewModal(true);
};




const isUserLoggedIn = sessionUser != null;
const isUserNotOwner = sessionUser?.id !== spot.ownerId;
const userHasReviewed = reviews.some(review => review.userId === sessionUser?.id);
const showPostReviewButton = isUserLoggedIn && isUserNotOwner && !userHasReviewed;

return (
  <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
          <img src={mainImageUrl} alt="Main" className="main-image" />
          <div className="small-images">
              {otherImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Additional ${index}`} />
              ))}
          </div>
      </div>
      <p>Hosted by {spot.Owner?.firstName}</p>
      <p>{spot.description}</p>
      <div className="callout-info">
          <p>Price: ${spot.price} / night</p>
          <p>Rating: <i className="fas fa-star"></i> {displayRating}{reviewText}</p>
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
      </div>
          <div className="reviews-section">
    <h2>Reviews</h2>
    {showPostReviewButton && (
        <button onClick={handlePostReviewClick}>Post Your Review</button>
    )}
    {reviews.length === 0 && isUserLoggedIn && isUserNotOwner ? (
        <p>Be the first to post a review!</p>
    ) : (
        reviews.map(review => (
            <div key={review.id} className="review">
                <div className='review-header'>
                <p>{review?.User?.firstName} - {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p> <ReadOnlyStarRating rating={review.stars} />
                </div>
                <p>{review.review}</p>
                {sessionUser?.id === review.userId && (
                            <button onClick={() => handleOpenDeleteReviewModal(review.id)}>Delete</button>
                        )}
            </div>
        ))
    )}
</div>
{showDeleteReviewModal && (
                <DeleteReviewModal
                    onConfirm={handleConfirmDeleteReview}
                    onCancel={handleCancelDeleteReview}
                />
            )}
        </div>
    );
};


export default SpotDetailPage;
