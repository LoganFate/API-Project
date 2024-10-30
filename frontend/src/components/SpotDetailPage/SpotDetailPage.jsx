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

    const eventsBySpotId = {
        1: [
            { title: "Karaoke Night", description: "Every Friday and Saturday Night starting at 9:30pm" },
            { title: "Baltimore Ravens Watch Party", description: "(Every Gameday) Watch Party Headquarters for: Ravens Roost 610 - $20 Gameday Beer Buckets - Featured Drinks" },
            { title: "Cougar Run Club", description: "Every Tuesday 7pm" },
            { title: "Mister Hotter Than Hell", description: "Calling all Hotties! Get selected to go to the finals and have a chance to be in a calendar where all proceeds go to cerebral palsy"}

        ],
        2: [
            { title: "Karaoke Night", description: "Every Friday and Saturday Night starting at 9:30pm" },
            { title: "Buffalo Bills Watch Party", description: "(Every Gameday) Watch Party Headquarters for Houston Bills Backers - $20 Gameday Beer Buckets - Featured Drinks - Sahlen’s Hotdogs"},
            { title: "Virginia Tech Watch Party", description: "$20 Gameday beer buckets, come watch the game with us!"},
            { title: "Hot Ones Tasting", description: "10 wings, 10 dollars, 10 levels of HOT"}
        ],
        3: [
            { title: "Ohio State Watch Party", description: "Every Gameday - $20 Gameday Beer Buckets"},
            { title: "Miami Dolphins Watch Party", description: "Every Game Day $20 Gameday Beer Buckets, Featured Drinks"},
            { title: "Detroit Lions Watch Party", description: "Nov 10th, $5 & $7 shots"},

        ],
        4: [
            { title: "Jets Watch Party", description: "Watch Party Headquarters for Houston Jets Fans Every Game Day $20 Gameday Beer Buckets, Featured Drinks"},
            { title: "Texas A&M Watch Party", Description: "Every Gameday"},
            { title: "Live Music", description: "On the patio Fridays at 6pm!"},
            { title: "Mister Hotter Than Hell", description: "The final round of all the previous winners! Winner will get their pictures on a calendar and all the proceeds go to cerebral palsy"}
        ]
    };

    const events = eventsBySpotId[spotId] || [];

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
                            <img src={imgUrl} alt={events[index]?.title || `Event ${index + 1}`} className="event-image" />
                            <div className="text-container">
                                <div className="event-description">
                                <h3>{events[index]?.title}</h3>
                                    <p>{events[index]?.description}</p>

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
