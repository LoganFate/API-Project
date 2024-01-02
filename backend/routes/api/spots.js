const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { Spot, Review, SpotImage, User } = require('../../db/models'); // Adjust the path as needed
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
                    as: 'PreviewImage',
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
            group: ['Spot.id', 'PreviewImage.id']
        });

        // Map through the results to format the response
        const formattedSpots = spots.map(spot => {
            const spotJSON = spot.toJSON();
            return {
                ...spotJSON,
                avgRating: spotJSON.avgRating ? parseFloat(spotJSON.avgRating.toFixed(2)) : null
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
                    as: 'PreviewImage',
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
            group: ['Spot.id', 'PreviewImage.id']
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
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const ownerId = req.user.id; // Assuming the user ID is stored in req.user

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
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            const validationErrors = {};
            error.errors.forEach(err => {
                validationErrors[err.path] = err.message;
            });

            return res.status(400).json({
                message: "Bad Request",
                errors: validationErrors
            });
        } else {
            return next(error);
        }
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
            return res.status(403).json({ message: "You don't have permission to add an image to this spot" });
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
            return res.status(403).json({ message: "You don't have permission to edit this spot" });
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





module.exports = router;
