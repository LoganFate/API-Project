const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');

router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId: currentUserId },
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'] // Include necessary attributes
        });

        for (const booking of bookings) {
            // Load spot data
            const spot = await booking.getSpot({
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            });

            if (spot) {
                // Load spot's preview image
                const previewImage = await SpotImage.findOne({
                    where: { spotId: spot.id, preview: true },
                    attributes: ['url']
                });

                // Format spot data including the preview image URL
                booking.dataValues.Spot = {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: parseFloat(spot.price),
                    previewImage: previewImage ? previewImage.url : null // Include only the URL
                };
            }
        }

        res.status(200).json({ Bookings: bookings });
    } catch (error) {
        next(error);
    }
});
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        // Check if the booking belongs to the current user
        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Initialize an errors object to accumulate validation errors
        const errors = {};
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const bookingEndDate = new Date(booking.endDate);

        // Check if the booking is past the end date
        if (bookingEndDate < today) {
            return res.status(403).json({ message: "Past bookings can't be modified" });
        }

        if (start < today) {
            errors.startDate = "startDate cannot be in the past";
        }
        if (end <= start) {
            errors.endDate = "endDate cannot be on or before startDate";
        }

        // Check for booking conflicts only if date validations pass
        if (Object.keys(errors).length === 0) {
            const overlappingBookings = await Booking.findAll({
                where: {
                    spotId: booking.spotId,
                    [Op.and]: [
                        { id: { [Op.ne]: bookingId } },
                        {
                            [Op.or]: [
                                { startDate: { [Op.between]: [start, end] } },
                                { endDate: { [Op.between]: [start, end] } },
                                {
                                    [Op.and]: [
                                        { startDate: { [Op.lte]: start } },
                                        { endDate: { [Op.gte]: end } }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            });

            if (overlappingBookings.length > 0) {
                errors.startDate = "Start date conflicts with an existing booking";
                errors.endDate = "End date conflicts with an existing booking";
            }
        }

        // Check if there are any errors accumulated
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Bad Request", errors });
        }

        // Update the booking
        booking.startDate = startDate;
        booking.endDate = endDate;
        await booking.save();

        return res.json(booking);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: { model: Spot }
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        // Check if the booking belongs to the current user or the spot belongs to the user
        if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Check if the booking has already started
        const today = new Date();
        if (new Date(booking.startDate) <= today) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        await booking.destroy();
        res.json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
