import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../../store/Actions/reviewActions';
import './ReviewForm.css'

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);

    const getColor = (ratingValue) => {
        if (hover !== 0) {
            return ratingValue <= hover ? "#ffc107" : "#e4e5e9";
        }
        return ratingValue <= rating ? "#ffc107" : "#e4e5e9";
    };

    return (
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;

          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                checked={ratingValue === rating}
                onChange={() => setRating(ratingValue)}
              />
              <span
                className="star"
                onMouseEnter={() => setHover(ratingValue)}
                onClick={() => setHover(ratingValue)}
                style={{ color: getColor(ratingValue) }}
              >&#9733;</span>
            </label>
          );
        })}
      </div>
    );
  };

const ReviewForm = ({ spotId, userId, onSubmitFail, onSubmitSuccess, serverError, closeModal }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();

    const handleCommentChange = (e) => {
        setComment(e.target.value);
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
        <div className="review-modal-container">
            <div className="review-modal">
                <h2>How was your stay?</h2>
                {serverError && <p className="error-message">{serverError}</p>}
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="form-field">
                        <textarea
                            className="review-textarea"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Leave your review here..."
                            rows="4"
                        />
                    </div>
                    <div className="form-field">
                        <label> Stars: </label>
                        <StarRating setRating={setRating} />
                    </div>
                    <button type="submit" className="review-submit-button" disabled={isSubmitDisabled}>
                        Submit Your Review
                    </button>
                </form>
            </div>
        </div>
    );
};


export default ReviewForm;
