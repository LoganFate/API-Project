import './SpotTile.css';

const SpotTile = ({ spot }) => {
    const displayRating = spot.avgRating ? spot.avgRating.toFixed(1) : "New";

    return (
        <div className="spot-tile" title={spot.name}>
            <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
            <div className="spot-info">
                <p>{`${spot.city}, ${spot.state}`}</p>
                <p className="spot-rating">{`Rating: ${displayRating}`}</p>
                <p className="spot-price">{`$${spot.price} / night`}</p>
            </div>
        </div>
    );
};

export default SpotTile;
