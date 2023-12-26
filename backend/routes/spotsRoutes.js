const express = require('express');
const { Spot, Review, SpotImage, Sequelize } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
            // Include logic to fetch the avgRating and previewImage
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

        res.json(spots.map(spot => {
            // Format the response
            return {
                ...spot.get(),
                avgRating: parseFloat(spot.get('avgRating').toFixed(2))
            };
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
