const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models'); // Adjust the path as needed
const router = express.Router();
const { requireAuth } = require('../../utils/auth');


router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
            include: [
                {
                    model: Review,
                    attributes: []
                },
                {
                    model: SpotImage,
                    as: 'previewImage',
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
                ],
                exclude: ['createdAt', 'updatedAt']
            },
            group: ['Spot.id', 'previewImage.id']
        });

        // Map through the results to format the response
        const formattedSpots = spots.map(spot => {
            const spotJSON = spot.toJSON();
            let avgRatingFormatted = null;

            // Check if avgRating is a number before calling toFixed
            if (typeof spotJSON.avgRating === 'number') {
                avgRatingFormatted = parseFloat(spotJSON.avgRating.toFixed(2));
            }

            return {
                ...spotJSON,
                avgRating: avgRatingFormatted
            };
        });

        res.json({ Spots: formattedSpots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: { ownerId: currentUserId },
            include: [
                {
                    model: Review,
                    attributes: []
                },
                {
                    model: SpotImage,
                    as: 'previewImage',
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
                ],
                exclude: ['createdAt', 'updatedAt']
            },
            group: ['Spot.id', 'previewImage.id']
        });

        res.status(200).json({ Spots: spots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Spot details by ID
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: SpotImage,
                    as: 'SpotImages',
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Review,
                    as: 'Reviews',
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
                ],
                exclude: ['createdAt', 'updatedAt']
            },
            group: ['Spot.id', 'SpotImages.id', 'Owner.id']
        });

        if (!spot) {
            res.status(404).json({ message: "Spot couldn't be found" });
        } else {
            res.status(200).json(spot);
        }
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
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

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

        if (spot.ownerId === currentUserId) {
            // User is the owner, return all bookings with user info
            const bookings = await Booking.findAll({
                where: { spotId },
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            });
            return res.json({ Bookings: bookings });
        } else {
            // User is not the owner, return bookings without user info
            const bookings = await Booking.findAll({
                where: { spotId },
                attributes: ['spotId', 'startDate', 'endDate']
            });
            return res.json({ Bookings: bookings });
        }
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
