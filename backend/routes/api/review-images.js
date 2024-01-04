const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();

// DELETE /api/review-images/:imageId to delete an existing review image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    try {
        // Find the image by ID
        const image = await ReviewImage.findByPk(imageId, {
            include: {
                model: Review,
                as: 'ReviewImages',
                attributes: ['userId']
            }
        });

        // Check if image exists
        if (!image) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        // Check if the image belongs to a review written by the current user
        if (image.Review && image.Review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Delete the image
        await image.destroy();

        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
