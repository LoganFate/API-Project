const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    try {
        // Find image by ID
        const image = await SpotImage.findByPk(imageId, {
            include: {
                model: Spot,
                attributes: ['ownerId']
            }
        });

        if (!image) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        if (image.Spot.ownerId !== userId) {
            return res.status(403).json({ message: "You do not have permission to delete this image." });
        }
        // Delete Image
        await image.destroy();
        return res.json({ message: "Successfully deleted" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
