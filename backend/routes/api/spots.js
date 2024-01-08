const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models'); // Adjust the path as needed
const router = express.Router();
const { requireAuth } = require('../../utils/auth');


router.get('/', async (req, res) => {
    // Parsing query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 20;
    const minLat = parseFloat(req.query.minLat);
    const maxLat = parseFloat(req.query.maxLat);
    const minLng = parseFloat(req.query.minLng);
    const maxLng = parseFloat(req.query.maxLng);
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    // Validation
    const errors = {};
    if (isNaN(page) || page < 1) errors.page = "Page must be greater than or equal to 1";
    if (isNaN(size) || size < 1) errors.size = "Size must be greater than or equal to 1";
    if (!isNaN(minLat) && (minLat < -90 || minLat > 90)) errors.minLat = "Minimum latitude is invalid";
    if (!isNaN(maxLat) && (maxLat < -90 || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
    if (!isNaN(minLng) && (minLng < -180 || minLng > 180)) errors.minLng = "Minimum longitude is invalid";
    if (!isNaN(maxLng) && (maxLng < -180 || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
    if (!isNaN(minPrice) && minPrice < 0) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (!isNaN(maxPrice) && maxPrice < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Bad Request", errors });
    }


    // Validate and set up pagination limits
    const limit = Math.min(Math.max(size, 1), 20); // Ensures size is between 1 and 20
    const offset = (Math.max(page, 1) - 1) * limit; // Ensures page is at least 1

    // Constructing the where clause based on query parameters
    const whereClause = {};
    if (!isNaN(minLat) && minLat >= -90 && minLat <= 90) whereClause.lat = { [Op.gte]: minLat };
    if (!isNaN(maxLat) && maxLat >= -90 && maxLat <= 90) whereClause.lat = { ...whereClause.lat, [Op.lte]: maxLat };
    if (!isNaN(minLng) && minLng >= -180 && minLng <= 180) whereClause.lng = { [Op.gte]: minLng };
    if (!isNaN(maxLng) && maxLng >= -180 && maxLng <= 180) whereClause.lng = { ...whereClause.lng, [Op.lte]: maxLng };
    if (!isNaN(minPrice) && minPrice >= 0) whereClause.price = { [Op.gte]: minPrice };
    if (!isNaN(maxPrice) && maxPrice >= 0) whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };

    try {
        const spots = await Spot.findAll({
            where: whereClause,
            include: [
                {
                    model: SpotImage,
                    as: 'previewImage',
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                }
            ],
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',],
            limit: limit,
            offset: offset,
        });


        // Lazy loading the average rating for each spot
        for (const spot of spots) {
            const avgRatingResult = await Review.findAll({
                where: { spotId: spot.id },
                attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
                raw: true,
        });

            let avgRating = avgRatingResult[0].avgRating;
            if (avgRating !== null && !isNaN(avgRating)) {
                // Convert to number and format to two decimal places
                avgRating = parseFloat(avgRating).toFixed(2);
            }
            spot.dataValues.avgRating = avgRating;
        }
          // Formatting the response
          const formattedSpots = spots.map(spot => {
            const spotJson = spot.toJSON();


              // Extract the URL from the first preview image, if available
              const previewImageUrl = spotJson.previewImage.length > 0 ? spotJson.previewImage[0].url : null;


              return {
                id: spotJson.id,
                ownerId: spotJson.ownerId,
                address: spotJson.address,
                city: spotJson.city,
                state: spotJson.state,
                country: spotJson.country,
                lat: spotJson.lat,
                lng: spotJson.lng,
                name: spotJson.name,
                description: spotJson.description,
                price: parseFloat(spotJson.price),
                createdAt: spotJson.createdAt,
                updatedAt: spotJson.updatedAt,
                avgRating: spotJson.avgRating !== null ? parseFloat(spotJson.avgRating) : null, // avgRating here
                previewImage: previewImageUrl, // previewImage here
            };
        });




        res.json({ Spots: formattedSpots, page, size });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: { ownerId: currentUserId },
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
            group: ['Spot.id']
        });

        for (const spot of spots) {
            // Load Reviews
            const reviews = await spot.getReviews({
                attributes: ['stars']
            });

            // Calculate average rating
            const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
            const avgRating = reviews.length ? (totalStars / reviews.length) : null;
            spot.dataValues.avgRating = avgRating !== null ? parseFloat(avgRating.toFixed(2)) : null;

            // Load SpotImages
            const previewImages = await spot.getSpotImages({
                where: { preview: true },
                attributes: ['url'],
                limit: 1
            });

            spot.dataValues.previewImage = previewImages.length > 0 ? previewImages[0].url : null;
            spot.dataValues.price = parseFloat(spot.price);
        }

        res.status(200).json({ Spots: spots.map(spot => spot.dataValues) });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId, {
            attributes: {

            }
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Lazy load SpotImages
        const spotImages = await spot.getSpotImages({
            attributes: ['id', 'url', 'preview']
        });

        // Lazy load Owner
        const owner = await spot.getOwner({
            attributes: ['id', 'firstName', 'lastName']
        });

        // Lazy load Reviews and calculate numReviews and avgStarRating
        const reviews = await spot.getReviews({
            attributes: ['id', 'stars']
        });

        const numReviews = reviews.length;
        const avgStarRating = reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews || 0;

        const response = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: parseFloat(avgStarRating.toFixed(1)),  // Format to one decimal place
            SpotImages: spotImages,
            Owner: owner
        };

        // Attaching lazy loaded data to the spot object
        spot.dataValues.SpotImages = spotImages;
        spot.dataValues.Owner = owner;
        spot.dataValues.numReviews = numReviews;
        spot.dataValues.avgStarRating = avgStarRating;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

// POST /api/spots to create a new spot
router.post('/', requireAuth, async (req, res, next) => {

        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const ownerId = req.user.id; // Assuming the user ID is stored in req.user
        const validationErrors = {};

        // Custom validation for each field
        if (!address) validationErrors.address = "Street address is required";
        if (!city) validationErrors.city = "City is required";
        if (!state) validationErrors.state = "State is required";
        if (!country) validationErrors.country = "Country is required";
        if (lat == null || lat < -90 || lat > 90) validationErrors.lat = "Latitude must be within -90 and 90";
        if (lng == null || lng < -180 || lng > 180) validationErrors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) validationErrors.name = "Name must be less than 50 characters";
        if (!description) validationErrors.description = "Description is required";
        if (!price || price <= 0) validationErrors.price = "Price per day must be a positive number";

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors: validationErrors
            });
        }

    try {
        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,

        });

        const spotResponse = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: newSpot.lat,
            lng: newSpot.lng,
            name: newSpot.name,
            description: newSpot.description,
            price: parseFloat(newSpot.price),
            createdAt: newSpot.createdAt,
            updatedAt: newSpot.updatedAt
        };


        return res.status(201).json(spotResponse);
    } catch (error) {
       return next (error);
    }
});

// POST /api/spots/:spotId/images to add a new image to a spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the spot belongs to the current user
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newImage = await SpotImage.create({
            spotId,
            url,
            preview
        });

        const response = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        };


        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
});


const validateFields = (body) => {
    const errors = {};
    if (!body.address) errors.address = "Street address is required";
    if (!body.city) errors.city = "City is required";
    if (!body.state) errors.state = "State is required";
    if (!body.country) errors.country = "Country is required";
    if (body.lat < -90 || body.lat > 90) errors.lat = "Latitude must be within -90 and 90";
    if (body.lng < -180 || body.lng > 180) errors.lng = "Longitude must be within -180 and 180";
    if (body.name && body.name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!body.description) errors.description = "Description is required";
    if (!body.price || body.price <= 0) errors.price = "Price per day must be a positive number";
    return errors;
  };
// PUT /api/spots/:spotId to update an existing spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    const errors = validateFields(req.body);
    if(Object.keys(errors).length) {
        return res.status(400).json({ message: "Bad Request", errors });
    }
    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the spot belongs to the current user
        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Update the spot
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save();

        return res.json(spot);
    } catch (error) {
        return next(error);
    }
});

// DELETE /api/spots/:spotId to delete an existing spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await spot.destroy();
        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        return next(error);
    }
});


// GET all reviews by a spot's ID
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    try {
        // Check if the spot exists
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Fetch reviews for the spot
        const reviews = await Review.findAll({
            where: { spotId }
        });

        // Lazy load associated User and ReviewImage for each review
        for (const review of reviews) {
            const user = await review.getUser({
                attributes: ['id', 'firstName', 'lastName']
            });
            const reviewImages = await review.getReviewImages({
                attributes: ['id', 'url']
            });

            // Attaching the user and images to each review
            review.dataValues.User = user;
            review.dataValues.ReviewImages = reviewImages;
        }

        res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        // Check if the spot exists
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if user already has a review for this spot
        const existingReview = await Review.findOne({ where: { userId, spotId } });
        if (existingReview) {
            return res.status(403).json({ message: "User already has a review for this spot" });
        }

        // Manual validation
        const errors = {};
        if (!review) errors.review = "Review text is required";
        if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

        if (Object.keys(errors).length) {
            return res.status(400).json({ message: "Bad Request", errors: errors });
        }

        // Create the review
        const newReview = await Review.create({ userId, spotId, review, stars });
        return res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const currentUserId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const bookings = await Booking.findAll({
            where: { spotId },
            attributes: spot.ownerId === currentUserId ? undefined : ['spotId', 'startDate', 'endDate']
        });

        if (spot.ownerId === currentUserId) {
            // User is the owner, load user info for each booking
            for (const booking of bookings) {
                const user = await booking.getUser({
                    attributes: ['id', 'firstName', 'lastName']
                });
                booking.dataValues.User = user;
            }
        }

        return res.json({ Bookings: bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const checkBookingConflict = async (spotId, startDate, endDate) => {
    const conflictingBooking = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    // New condition: new booking's startDate should not be the same as any existing booking's endDate
                    endDate: {
                        [Op.eq]: startDate
                    }
                },
                {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.lte]: startDate,
                            },
                        },
                        {
                            endDate: {
                                [Op.gte]: endDate,
                            },
                        },
                    ],
                },
            ],
        },
    });

    if (conflictingBooking) {
        return {
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking",
            },
        };
    }

    return null;
};
// Function to validate booking dates
const validateBookingDates = (startDate, endDate) => {
    const errors = {};
    const currentDate = new Date();
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (startDate < currentDate) {
        errors.startDate = "startDate cannot be in the past";
    }

    if (endDate <= startDate) {
        errors.endDate = "endDate cannot be on or before startDate";
    }

    return errors;
};

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    // Validate booking dates
    const dateErrors = validateBookingDates(startDate, endDate);

    // Check for booking conflicts
    const conflictError = await checkBookingConflict(spotId, startDate, endDate);

    // Combine errors
    const errors = { ...dateErrors, ...conflictError?.errors };

    // Check if there are any errors
    if (Object.keys(errors).length) {
        return res.status(400).json({ message: "Bad Request", errors });
    }

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        // Check if spot belongs to current user
        if (spot.ownerId === userId) {
            return res.status(403).json({ message: "You cannot create a booking for your own spot."})
        }
        // Create new booking
        const newBooking = await Booking.create({
            userId,
            spotId,
            startDate,
            endDate,
        });

        return res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
