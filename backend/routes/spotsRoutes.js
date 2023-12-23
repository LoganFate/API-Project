const express = require('express');
const { Spot, Review, SpotImage } = require('../models');
const router = express.Router();

router.get('/spots', async (req, res) => {
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
                    where: { preview: true },
                    required: false
                }
            ],
            attributes: {
                include: [
                    // Include the avgRating calculation here
                    // Example: [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'avgRating']
                ]
            },
            group: ['Spot.id']
        });

        res.json(spots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
