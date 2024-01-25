import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserSpots, deleteSpot } from '../../store/Actions/spotActions';
import SpotTile from '../LandingPage/SpotTile';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './ManageSpots.css';

const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);
    const sessionUser = useSelector(state => state.session.user);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const navigate = useNavigate();

    const handleUpdateSpot = (spotId) => {
        const spotToUpdate = userSpots.find(spot => spot.id === spotId);
        navigate(`/spots/${spotId}/update`, { state: { spot: spotToUpdate } });
    };



    const handleConfirmDelete = (spotId) => {
        dispatch(deleteSpot(spotId));
        setShowDeleteModal(false);
      };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSpot = (spotId, spotName) => {
        setSelectedSpot({ id: spotId, name: spotName});
        setShowDeleteModal(true);
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
                  <SpotTile key={spot.id} spot={spot} onUpdate={() => handleUpdateSpot(spot.id)} onDelete={() => handleDeleteSpot(spot.id, spot.name)} />

                ))}
            </div>
   {showDeleteModal && selectedSpot &&
   <ConfirmDeleteModal
   spotName={selectedSpot.name}
   onConfirm={() => handleConfirmDelete(selectedSpot.id)}
   onCancel={handleCancelDelete}
 />
}
        </div>
    );
};

export default ManageSpotsPage;
