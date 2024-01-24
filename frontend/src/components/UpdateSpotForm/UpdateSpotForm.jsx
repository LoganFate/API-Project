import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const UpdateSpotForm = ({ spot }) => {
    const [formData, setFormData] = useState({
        name: spot.name,
        description: spot.description,
        // ... other fields
    });
    const history = useHistory();

    useEffect(() => {
        if (!spot) {
            // Redirect if no spot data is available
            history.push('/spots/current');
        }
    }, [spot, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle update logic
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Update Your Spot</h1>
            {/* Form fields */}
            <button type="submit">Update Your Spot</button>
        </form>
    );
};

export default UpdateSpotForm;
