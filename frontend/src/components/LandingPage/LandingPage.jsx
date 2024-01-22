import { useEffect, useState } from "react";
import SpotTile from "./SpotTile";
import './SpotTile.css';

const LandingPage = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await fetch('/api/spots');
                const data = await response.json();
                if (data && data.Spots) {
                    setSpots(data.Spots);
                }
            } catch (error) {
                console.error('Failed to fetch spots:', error);
            }
        };
        fetchSpots();
    }, []);

    return (
        <div>
            <h1>All Spots</h1>
            <div className="spot-list">
                {spots.map(spot => (
                    <SpotTile key={spot.id} spot={spot} />
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
