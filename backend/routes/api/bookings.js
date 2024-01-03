const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId: currentUserId },
            include: [
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
                }
            ]
        });

        res.status(200).json({ Bookings: bookings });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
