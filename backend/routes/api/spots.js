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



module.exports = router;
