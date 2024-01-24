import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserSpots } from '../../store/Actions/spotActions';
import SpotTile from '../LandingPage/SpotTile';
import './ManageSpots.css';

const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);
    const sessionUser = useSelector(state => state.session.user);

    const handleUpdateSpot = (spotId) => {
        console.log(`Update Spot: ${spotId}`);
        // Add logic for updating a spot
    };

    const handleDeleteSpot = (spotId) => {
        console.log(`Delete Spot: ${spotId}`);
        // Add logic for deleting a spot
    };

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchUserSpots(sessionUser.id));
        }
    }, [dispatch, sessionUser]);

    if (!userSpots || userSpots.length === 0) {
        return (
            <div className='manage-spots-container'>
                <h1>Manage Spots</h1>
                <Link to="/spots/new">Create a New Spot</Link>
            </div>
        );
    }

    return (
        <div className='manage-spots-container'>
            <h1>Manage Spots</h1>
            <div className='spot-tiles'>
                {userSpots.map(spot => (
                    <SpotTile key={spot.id} spot={spot} onUpdate={handleUpdateSpot} onDelete={handleDeleteSpot} />
                ))}
            </div>
        </div>
    );
};

export default ManageSpotsPage;
