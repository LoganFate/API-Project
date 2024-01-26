import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSpot } from '../../store/Actions/spotActions';
import './CreateSpotForm.css'

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

    function validateLat(lat) {
        if (lat === "" || lat === null) return null; // Return null for empty or null inputs
        lat = parseFloat(lat);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return "Latitude must be between -90 and 90"; // Return error message for invalid values
        }
        return lat; // Return the parsed number for valid inputs
      }

      function validateLng(lng) {
        if (lng === "" || lng === null) return null; // Return null for empty or null inputs
        lng = parseFloat(lng);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return "Longitude must be between -180 and 180"; // Return error message for invalid values
        }
        return lng; // Return the parsed number for valid inputs
      }


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
        const hasImage = previewImageUrl || imageUrls.some(url => url.trim() !== '');
    if (!hasImage) {
        newErrors.images = 'You must submit at least one image of your spot.';
    }
    const latError = validateLat(lat);
    const lngError = validateLng(lng);
    if (latError) newErrors.lat = latError;
    if (lngError) newErrors.lng = lngError;


        setErrors(newErrors); // Set the errors state immediately
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate(); // This will set the errors state as well
        if (!isValid) {
            return; // Stop the form submission if there are errors
        }

        try {
            const spotData = {
                ownerId,
                country,
                address,
                city,
                state,
                lat: lat === "" ? null : validateLat(lat),
                lng: lng === "" ? null  : validateLng(lng),
                description,
                name: title,
                price: parseFloat(price),
                previewImageUrl,
                imageUrls: imageUrls.filter(url => url !== '')
            };

            const response = await dispatch(createSpot(spotData));


          // Check if the response status is successful
          if (response.spot) {
            navigate(`/spots/${response.spot.id}`);
          } else if (response.error) {
            console.error('Error details:', response.error);
            setErrors({ form: "Failed to create spot", ...response.error.errors });
          }
        } catch (networkError) {
          console.error('Network error:', networkError);
          setErrors({ form: networkError.message || "Network error, failed to create spot" });
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
        <form onSubmit={handleSubmit} className="create-spot-form">
            <h1>Create a New Spot</h1>
            {/* Location section */}
            <section>
                <h2>Where&apos;s your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label htmlFor="country">Country</label>
        {errors.country && <p className="error-message">{errors.country}</p>}
        <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className={errors.country ? 'input-error' : ''}
        />

        <label htmlFor="address">Street Address</label>
        {errors.address && <p className="error-message">{errors.address}</p>}
        <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street Address"
            className={errors.address ? 'input-error' : ''}
        />

        <label htmlFor="city">City</label>
        {errors.city && <p className="error-message">{errors.city}</p>}
        <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className={errors.city ? 'input-error' : ''}
        />

        <label htmlFor="state">State</label>
        {errors.state && <p className="error-message">{errors.state}</p>}
        <input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            className={errors.state ? 'input-error' : ''}
        />
    </section>
 {/* Latitude and Longitude inputs (optional for MVP) */}
 <section>
                <h2>Location Coordinates (Optional)</h2>
                {errors.location && <p className="error-message">{errors.location}</p>}

    <label htmlFor="lat">Latitude</label>
    <input
        id="lat"
        type="number"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
        className={errors.location ? 'input-error' : ''}
    />

    <label htmlFor="lng">Longitude</label>
    <input
        id="lng"
        type="number"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        placeholder="Longitude"
        className={errors.location ? 'input-error' : ''}
    />
</section>
            {/* Description section */}
            <section>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        {errors.description && <p className="error-message">{errors.description}</p>}
        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            className={errors.description ? 'input-error' : ''}
        />
    </section>

    <section>
        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        {errors.title && <p className="error-message">{errors.title}</p>}
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of your spot"
            className={errors.title ? 'input-error' : ''}
        />
    </section>

    <section>
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        {errors.price && <p className="error-message">{errors.price}</p>}
        <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            className={errors.price ? 'input-error' : ''}
        />
            </section>

            {/* Photos section */}
            <section>
                <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                {errors.images && <p className="error-message">{errors.images}</p>}

<label htmlFor="previewImageUrl">Preview Image URL</label>
<input
    type="text"
    id="previewImageUrl"
    value={previewImageUrl}
    onChange={(e) => setPreviewImageUrl(e.target.value)}
    placeholder="Preview Image URL"
    className={errors.images ? 'input-error' : ''}
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
        placeholder={`Image URL ${index + 1}`}
        className={errors.images ? 'input-error' : ''}
    />
))}
</section>
            {/* Submit button */}
            <button type="submit">Create Spot</button>
            {/* Display error messages */}
        </form>
    );
}

export default CreateSpotForm;
