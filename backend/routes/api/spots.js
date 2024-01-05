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
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'],
            limit: limit,
            offset: offset,
        });

        // Lazy loading the average rating for each spot
        for (const spot of spots) {
            const avgRating = await Review.findAll({
                where: { spotId: spot.id },
                attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
                raw: true,
            });

            spot.dataValues.avgRating = avgRating[0].avgRating ? parseFloat(avgRating[0].avgRating.toFixed(2)) : null;
        }

        // Formatting the response
        const formattedSpots = spots.map(spot => spot.toJSON());

        res.json({ Spots: formattedSpots, page, size });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    try {
        // Fetching spots without eager loading
        const spots = await Spot.findAll({
            where: { ownerId: currentUserId },
            attributes: {
                include: [
                    // The average rating calculation will need to be adjusted since we are not eagerly loading Reviews
                ],
                exclude: ['createdAt', 'updatedAt']
            },
            group: ['Spot.id']
        });

        // Manually load associated models (lazy loading)
        for (const spot of spots) {
            // Load Reviews for each spot if necessary
            const reviews = await spot.getReviews({
                attributes: ['stars']
            });

            // Calculate average rating based on loaded reviews
            spot.dataValues.avgRating = reviews.length
                ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length
                : null;

            // Load SpotImages for each spot
            const previewImage = await spot.getSpotImages({
                where: { preview: true },
                attributes: ['url']
            });

            spot.dataValues.previewImage = previewImage;
        }

        res.status(200).json({ Spots: spots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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

        // Attaching lazy loaded data to the spot object
        spot.dataValues.SpotImages = spotImages;
        spot.dataValues.Owner = owner;
        spot.dataValues.numReviews = numReviews;
        spot.dataValues.avgStarRating = avgStarRating;

        res.status(200).json(spot);
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
            price
        });

        return res.status(201).json(newSpot);
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

        return res.status(200).json(newImage);
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

// Function to check for booking conflicts
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

// POST /api/spots/:spotId/bookings - Create a booking for a spot
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

     // Validate booking dates
     const dateErrors = validateBookingDates(startDate, endDate);
     if (Object.keys(dateErrors).length) {
         return res.status(400).json({ message: "Bad Request", errors: dateErrors });
     }

    // Check for booking conflicts
    const conflictError = await checkBookingConflict(spotId, startDate, endDate);
    if (conflictError) return res.status(403).json(conflictError);

    try {
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
