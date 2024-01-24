import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SpotDetailPage.css'
const SpotDetailPage = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const sessionUser = useSelector(state => state.session.user);


  useEffect(() => {
    const fetchSpotDetails = async () => {
        try {
            const response = await fetch(`/api/spots/${spotId}`);
            const data = await response.json();
            setSpot(data);

            const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
            const reviewsData = await reviewsResponse.json();
            if (reviewsData && reviewsData.Reviews) {
              setReviews(reviewsData.Reviews || []);
            }
        } catch (error) {
            console.error('Error fetching spot details:', error);
        }
    };
    fetchSpotDetails();
}, [spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  const mainImageUrl = spot.SpotImages && spot.SpotImages.length > 0
  ? spot.SpotImages[0].url
  : spot.mainImageUrl ; // URL of the main image
const otherImages = spot.SpotImages.slice(1).map(image => image.url); // URLs of other images

  // Determine the display rating
  const displayRating = spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)}` : "New";
  const reviewCount = spot.numReviews || 0;
  const isUserLoggedIn = sessionUser != null;
  const isUserNotOwner = sessionUser?.id !== spot.ownerId;

  let reviewText = '';
  if (reviewCount > 0) {
    reviewText = reviewCount === 1 ? ` · 1 Review` : ` · ${reviewCount} Reviews`;
  }

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

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
      {/* Callout information box */}
      <div className="callout-info">
        <p>Price: ${spot.price} / night</p>
        <p>Rating: <i className="fas fa-star"></i> {displayRating}{reviewText}</p>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>

      </div>
  {/* Reviews section */}
  <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 && isUserLoggedIn && isUserNotOwner ? (
          <p>Be the first to post a review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review">
              <p>{review.User.firstName} - {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
            </div>
          ))
        )}
</div>
  </div>
);
};

export default SpotDetailPage;
