import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReviewForm from '../ReviewForm/ReviewForm';
import { useModal } from '../../context/Modal';
import { addReview, fetchReviews } from '../../store/Actions/reviewActions';
import { fetchSpotDetails } from '../../store/Actions/spotActions';
import './SpotDetailPage.css';


const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent } = useModal();

    const spot = useSelector(state => state.spots.currentSpot);
    const reviews = useSelector(state => state.reviews.reviews);
    const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId)); // Fetch spot details from Redux action
    dispatch(fetchReviews(spotId)); // Fetch reviews from Redux action
  }, [dispatch, spotId, sessionUser?.id]);

  const handleReviewSubmission = async (reviewData) => {
    try {
      await dispatch(addReview(spotId, reviewData, sessionUser.id));
      setModalContent(null); // Close the modal on success
    } catch (error) {
      console.error('Error submitting review:', error);
    }
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
                <p>{review?.User?.firstName} - {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                <p>{review.review}</p>
            </div>
        ))
    )}
</div>
  </div>
);
};


export default SpotDetailPage;
