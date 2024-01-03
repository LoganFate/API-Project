const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, SpotImage, } = require('../../db/models');
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

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    // Validate the input
    if (!review) {
        return res.status(400).json({ message: "Bad Request", errors: { review: "Review text is required" } });
    }
    if (!stars || stars < 1 || stars > 5) {
        return res.status(400).json({ message: "Bad Request", errors: { stars: "Stars must be an integer from 1 to 5" } });
    }

    try {
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Check if the review belongs to the current user
        if (existingReview.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Update the review
        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        // Respond with the updated review
        return res.json(existingReview);
    } catch (error) {
        next(error);
    }
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
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

        // Delete the review
        await review.destroy();

        // Respond with a success message
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

// PUT /api/bookings/:bookingId to update an existing booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        // Check if the booking belongs to the current user
        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Validate dates
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start < today) {
            return res.status(400).json({ message: "Bad Request", errors: { startDate: "startDate cannot be in the past" } });
        }
        if (end <= start) {
            return res.status(400).json({ message: "Bad Request", errors: { endDate: "endDate cannot be on or before startDate" } });
        }

        // Check for booking conflicts
        const existingBookings = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: { [Op.ne]: bookingId } // Exclude the current booking
            }
        });

        for (let existingBooking of existingBookings) {
            const existingStart = new Date(existingBooking.startDate);
            const existingEnd = new Date(existingBooking.endDate);

            if ((start >= existingStart && start < existingEnd) ||
                (end > existingStart && end <= existingEnd) ||
                (start <= existingStart && end >= existingEnd)) {
                return res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates" });
            }
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

module.exports = router;
