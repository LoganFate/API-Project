import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSpot } from '../../store/Actions/spotActions';
import './UpdateSpotForm.css'

const UpdateSpotForm = () => {
    const { spotId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const spot = location.state?.spot;
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImageUrl: '',
        imageUrls: spot ? spot.imageUrls : Array(4).fill(''),
        lat: spot ? spot.lat.toString() : '',
        lng: spot ? spot.lng.toString() : '',
    });

    const validate = () => {
        const newErrors = {};
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.address) newErrors.address = 'Street Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.name) newErrors.name = 'Title is required';
        if (!formData.price) newErrors.price = 'Price per night is required';

        if (formData.description.length < 30) newErrors.description = 'Description needs 30 or more characters';

        // Validate latitude
        if (formData.lat !== "" && formData.lat !== null) {
            const parsedLat = parseFloat(formData.lat);
            if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
                newErrors.lat = 'Latitude must be between -90 and 90';
            }
        }
        // Validate longitude
        if (formData.lng !== "" && formData.lng !== null) {
            const parsedLng = parseFloat(formData.lng);
            if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
                newErrors.lng = 'Longitude must be between -180 and 180';
            }
        }
        const parsedPrice = parseFloat(formData.price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            newErrors.price = "Price per day must be a positive number";
        }


        return newErrors;
    };

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
                previewImage: spot.previewImage,
                imageUrls: spot.imageUrls || Array(4).fill(''),
                // Set other fields as needed
            });
        } else {
            // Redirect if no spot data is passed
            navigate('/spots/current');
        }
    }, [spot, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedFormData = {
            ...formData,
            previewImageUrl: formData.previewImageUrl || spot.previewImageUrl || '',
            imageUrls: formData.imageUrls.filter(url => url !== ''),
        };

        try {
            const updatedSpot = await dispatch(updateSpot(spotId, updatedFormData));
            if (updatedSpot) {
                navigate(`/spots/${spotId}`);
            }
        } catch (error) {
            // Handle the error and update the errors state
            if (error.response) {
                const { data } = error.response;
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            }
        }
    };
    const handleChange = (e) => {
        if (e.target.name.startsWith("imageUrl")) {
            const index = parseInt(e.target.name.replace("imageUrl", ""));
            const newImageUrls = [...formData.imageUrls];
            newImageUrls[index] = e.target.value;
            setFormData({ ...formData, imageUrls: newImageUrls });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
    return (
        <form onSubmit={handleSubmit} className='update-spot-form'>
            <h1>Update Your Spot</h1>

            {/* Location Section */}
            <section>
                <h2>Location Details</h2>
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={errors.country ? 'input-error' : ''}
                />
                {errors.country && <p className="error-message">{errors.country}</p>}
                <label htmlFor="address">Street Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <p className="error-message">{errors.address}</p>}
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <p className="error-message">{errors.city}</p>}
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={errors.state ? 'input-error' : ''}
                />
                {errors.state && <p className="error-message">{errors.state}</p>}
                <h2>Location Coordinates</h2>
    <label htmlFor="lat">Latitude</label>
                <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className={errors.lat ? 'input-error' : ''}
                />
                {errors.lat && <p className="error-message">{errors.lat}</p>}
                <label htmlFor="lng">Longitude</label>
                <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className={errors.lng ? 'input-error' : ''}
                />
                {errors.lng && <p className="error-message">{errors.lng}</p>}
            </section>

            {/* Description Section */}
            <section>
                <h2>Description</h2>
                <p>30 characters or more...</p>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your spot"
                    className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <p className="error-message">{errors.description}</p>}
            </section>

            {/* Title and Pricing Section */}
            <section>
                <h2>Title</h2>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Title"
                    className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
                <h2>Pricing</h2>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price per night"
                    className={errors.price ? 'input-error' : ''}
                />
                {errors.price && <p className="error-message">{errors.price}</p>}
            </section>

            {/* Image URL Section */}
            <section>
                <h2>Images (Optional)</h2>
                <input
                    type="text"
                    name="previewImageUrl"
                    value={formData.previewImageUrl}
                    onChange={handleChange}
                    placeholder="Preview Image URL"
                    className={errors.previewImageUrl ? 'input-error' : ''}
                />
                {errors.previewImageUrl && <p className="error-message">{errors.previewImageUrl}</p>}
                {formData.imageUrls && formData.imageUrls.map((url, index) => (
    <input
        key={index}
        type="text"
        name={`imageUrl${index}`}
        value={url}
        onChange={handleChange}
        placeholder={`Image URL ${index + 1}`}
        className={errors.images ? 'input-error' : ''}
    />
))}
</section>
            <button type="submit">Update Your Spot</button>
        </form>
    );
};

export default UpdateSpotForm;
