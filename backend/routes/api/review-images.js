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
                attributes: ['userId']
            }
        });

         // Check if the image exists
         if (!image) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

         // Check if the associated review is found
         if (!image.Review) {
            return res.status(404).json({ message: "Associated review not found" });
        }

        // Check if the image belongs to a review written by the current user
        if (image.Review.user !== userId) {
            return res.status(403).json({ message: "You do not have permission to delete this image." });
        }

        // Delete the image
        await image.destroy();

        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
