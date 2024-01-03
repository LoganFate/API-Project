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

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the review belongs to the current user
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Check the number of images associated with the review
        const countImages = await ReviewImage.count({ where: { reviewId } });
        if (countImages >= 10) {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
        }

        // Create a new image for the review
        const newImage = await ReviewImage.create({ reviewId, url });
        return res.status(201).json({
            id: newImage.id,
            url: newImage.url
        });
    } catch (error) {
        next(error);
    }
});



module.exports = router;
