import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../../store/Actions/reviewActions';
import './ReviewForm.css'

const ReviewForm = ({ spotId, userId, onSubmitFail, onSubmitSuccess, serverError, closeModal }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length >= 10 && rating > 0) {
            try {
                const reviewData = {
                    spotId: parseInt(spotId),
                    userId: userId,
                    review: comment,
                    stars: parseInt(rating)
                };
                const newReview = await dispatch(addReview(spotId, reviewData));
                closeModal();
                if (onSubmitSuccess) {

                    onSubmitSuccess(newReview);
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                if (onSubmitFail) {
                    onSubmitFail(error); // Pass the error to a failure handler if provided
                }
            }
        }
    };

     const isSubmitDisabled = comment.length < 10 || rating === 0;

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h2>How was your stay?</h2>
            {serverError && <p className="error">{serverError}</p>}
            <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Leave your review here..."
                rows="4"
            />
            <div>
                <label htmlFor="rating">Stars: </label>
                <select id="rating" value={rating} onChange={handleRatingChange}>
                    <option value="0">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
            </div>
            <button type="submit" disabled={isSubmitDisabled}>
                Submit Your Review
            </button>
        </form>
    );
};

export default ReviewForm;
