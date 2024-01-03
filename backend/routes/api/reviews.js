const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const router = express.Router();



router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    try {
        const reviews = await Review.findAll({
            where: { userId: currentUserId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    include: {
                        model: SpotImage,
                        as: 'previewImage',
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    },
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        res.status(200).json({ Reviews: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
