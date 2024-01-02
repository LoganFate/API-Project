const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { Spot, Review, SpotImage } = require('../../db/models'); // Adjust the path as needed
const router = express.Router();

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

module.exports = router;
