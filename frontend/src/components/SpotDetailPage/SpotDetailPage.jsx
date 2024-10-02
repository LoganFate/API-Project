import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotDetails } from '../../store/Actions/spotActions';
import './SpotDetailPage.css';

const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.currentSpot);


    useEffect(() => {
        dispatch(fetchSpotDetails(spotId)); // Fetch spot details from Redux action
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>Loading...</div>;
    }

    const mainImageUrl = spot.SpotImages && spot.SpotImages.length > 0
        ? spot.SpotImages[0].url
        : spot.mainImageUrl;
    const otherImages = spot.SpotImages ? spot.SpotImages.slice(1).map(image => image.url) : [];

    const eventTitlesAndDescriptions = [
        {
            title: "Karaoke Night",
            description: "Every Friday and Saturday Night starting at 9:30pm",
        },
        {
            title: "Baltimore Ravens Watch Party",
            description: "(Every Gameday) Watch Party Headquarters for: Ravens Roost 610 - $20 Gameday Beer Buckets - Featured Drinks",
        },
        {
            title: "Cougar Run Club",
            description: "Every Tuesday 7pm",
        },
        {
            title: "Yappy Hour",
            description: "October 12th 5-7:30pm | October 19th 7:30-9:30pm",
        },
    ];

    return (
        <div className="spot-detail">
            <h1>{spot.name}</h1>
            <div className="text-container">
                <p className="location-address">
                    Location: {spot.city}, {spot.state}
                </p>
            </div>
            <div className="spot-images">
                {/* Main Image */}
                <img src={mainImageUrl} alt="Main" className="main-image" />
                {/* Secondary Images (Event images with descriptions stacked vertically) */}
                <div className="small-images">
                    {otherImages.map((imgUrl, index) => (
                        <div key={index} className="event-block">
                            <img src={imgUrl} alt={eventTitlesAndDescriptions[index].title} className="event-image" />
                            <div className="text-container">
                                <div className="event-description">
                                    <h3>{eventTitlesAndDescriptions[index].title}</h3>
                                    <p>{eventTitlesAndDescriptions[index].description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpotDetailPage;
