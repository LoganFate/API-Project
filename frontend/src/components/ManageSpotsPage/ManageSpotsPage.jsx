import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserSpots } from '../../store/Actions/spotActions';

const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchUserSpots(sessionUser.id));
        }
    }, [dispatch, sessionUser]);

    return (
        <div>
            <h1>Manage Spots</h1>
            <ul>
                {userSpots.map(spot => (
                    <li key={spot.id}>{spot.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ManageSpotsPage;
