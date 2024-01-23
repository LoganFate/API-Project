import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SpotDetailPage = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        const data = await response.json();
        setSpot(data);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    };

    fetchSpotDetails();
  }, [spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  const otherImages = spot.otherImages || [];

  // Determine the display rating
  const displayRating = spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)}` : "New";
  const reviewCount = spot.numReviews || 0;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        <img src={spot.mainImageUrl} alt="Main" className="main-image" />
        <div className="small-images">
          {otherImages.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt={`Additional ${index}`} />
          ))}
        </div>
      </div>
      <p>Hosted by {spot.Owner.firstName}</p>
      <p>{spot.description}</p>
      {/* Callout information box */}
      <div className="callout-info">
        <p>Price: ${spot.price} / night</p>
        <p>Rating: <i className="fas fa-star"></i> {displayRating} ({reviewCount} reviews)</p>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
      </div>
    </div>
  );
};

export default SpotDetailPage;
