import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSpot } from '../../store/Actions/spotActions';

function CreateSpotForm() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState(Array(4).fill(''));
    const [errors, setErrors] = useState({});
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const ownerId = sessionUser ? sessionUser.id : null;

    const validate = () => {
        const newErrors = {};
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Street Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!title) newErrors.title = 'Title is required';
        if (!price) newErrors.price = 'Price per night is required';
        if (!previewImageUrl) newErrors.previewImageUrl = 'Preview Image URL is required';
        if (description.length < 30) newErrors.description = 'Description needs 30 or more characters';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        try {
            const spotData = {
                ownerId,
                country,
                address,
                city,
                state,
                lat: parseFloat(lat),
                lng: parseFloat (lng),
                description,
                name: title,
                price: parseFloat(price),
                previewImageUrl,
                imageUrls: imageUrls.filter(url => url !== '')
            };

            const response = await dispatch(createSpot(spotData));

            if (response) {
                navigate(`/spots/${response.id}`);
            } else {
                setErrors({ form: "Failed to create spot" });
            }
        } catch (error) {
            console.error('Error creating spot:', error);
            setErrors({ form: error.message || "Error creating spot" });
        }
    };

    const clearForm = () => {
        setCountry('');
        setAddress('');
        setCity('');
        setState('');
        setDescription('');
        setTitle('');
        setPrice('');
        setPreviewImageUrl('');
        setImageUrls(Array(4).fill(''));
        setErrors({});
    };

    useEffect(() => {
        return () => clearForm();
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create a New Spot</h1>
            {/* Location section */}
            <section>
                <h2>Where&apos;s your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                />
                <label htmlFor="address">Street Address</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                />
                <label htmlFor="city">City</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                />
                <label htmlFor="state">State</label>
                <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                />
                {/* Include latitude and longitude inputs here if needed */}
            </section>
 {/* Latitude and Longitude inputs (optional for MVP) */}
 <section>
                <h2>Location Coordinates (Optional)</h2>
                <label htmlFor="lat">Latitude</label>
                <input
                    id="lat"
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude"
                />
                <label htmlFor="lng">Longitude</label>
                <input
                    id="lng"
                    type="number"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Longitude"
                />
            </section>
            {/* Description section */}
            <section>
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please write at least 30 characters"
                />
            </section>

            {/* Title section */}
            <section>
                <h2>Create a title for your spot</h2>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Name of your spot"
                />
            </section>

            {/* Pricing section */}
            <section>
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price per night (USD)"
                />
            </section>

            {/* Photos section */}
            <section>
                <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    value={previewImageUrl}
                    onChange={(e) => setPreviewImageUrl(e.target.value)}
                    placeholder="Preview Image URL"
                />
                {imageUrls.map((url, index) => (
                    <input
                        key={index}
                        type="text"
                        value={url}
                        onChange={(e) => {
                            const newImageUrls = [...imageUrls];
                            newImageUrls[index] = e.target.value;
                            setImageUrls(newImageUrls);
                        }}
                        placeholder="Image URL"
                    />
                ))}
            </section>

            {/* Submit button */}
            <button type="submit">Create Spot</button>
            {/* Display error messages */}
            {Object.keys(errors).map((errorKey) => (
                <p key={errorKey} className="error-message">{errors[errorKey]}</p>
            ))}
        </form>
    );
}

export default CreateSpotForm;
