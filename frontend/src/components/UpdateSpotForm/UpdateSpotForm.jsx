import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSpot } from '../../store/Actions/spotActions';

const UpdateSpotForm = () => {
    const { spotId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const spot = location.state?.spot;
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImageUrl: '',
        imageUrls: Array(4).fill(''),
        lat: '',
        lng: ''
        // Add other fields as necessary
    });

    useEffect(() => {

        if (spot) {
            setFormData({
                name: spot.name,
                description: spot.description,
                country: spot.country,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                lat: spot.lat.toString(), // Ensure lat and lng are strings
                lng: spot.lng.toString(),
                price: spot.price.toString(),
                previewImageUrl: spot.previewImageUrl,
                // Set other fields as needed
            });
        } else {
            // Redirect if no spot data is passed
            navigate('/spots/current');
        }
    }, [spot, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedSpot = await dispatch(updateSpot(spotId, formData));
        if (updatedSpot) {
            navigate(`/spots/${spotId}`); // Redirect to the updated spot's detail page
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Update Your Spot</h1>
          {/* Location Section */}
          <section>
                <h2>Location Details</h2>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                />
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address"
                />
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                />
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                />
                <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    placeholder="Latitude"
                />
                <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    placeholder="Longitude"
                />
            </section>

            {/* Description Section */}
            <section>
                <h2>Description</h2>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your spot"
                />
            </section>

            {/* Title and Pricing Section */}
            <section>
                <h2>Title and Pricing</h2>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price per night"
                />
            </section>

            {/* Image URL Section */}
            <section>
                <h2>Images</h2>
                <input
                    type="text"
                    name="previewImageUrl"
                    value={formData.previewImageUrl}
                    onChange={handleChange}
                    placeholder="Preview Image URL"
                />
                {/* Include other image URL inputs here */}
            </section>

            <button type="submit">Update Your Spot</button>
        </form>
    );
};

export default UpdateSpotForm;
