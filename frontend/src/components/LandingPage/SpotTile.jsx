import { NavLink } from 'react-router-dom'
import './SpotTile.css'

const SpotTile = ({ spot, onUpdate, onDelete }) => {
    const pricePerNight = spot.price !== undefined ? spot.price : "Price Unavailable";

    const previewImage = spot.previewImage || 'default-image-url.jpg';


    return (
        <div className="spot-tile-container">
        <NavLink to={`/spots/${spot.id}`} className="spot-tile" title={spot.name}>
            <img src={previewImage} alt={spot.name || 'Spot'} className="spot-thumbnail" />
            <div className="spot-info">
                <p id="spot-location">{`${spot.city}, ${spot.state}`}</p>
                <p className="spot-price">
                    {pricePerNight}
                </p>
            </div>
        </NavLink>
        {onUpdate && onDelete && (
                <div className="spot-tile-actions">
                    <button onClick={() => onUpdate(spot.id)} className="update-button">Update</button>
                    <button onClick={() => onDelete(spot.id)} className="delete-button">Delete</button>
                </div>
        )}
     </div>
    );
};

export default SpotTile;
