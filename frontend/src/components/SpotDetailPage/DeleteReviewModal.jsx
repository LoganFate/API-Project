import './DeleteReview.css'


const DeleteReviewModal = ({ reviewId, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="confirmation-buttons">
                <button onClick={() => onConfirm(reviewId)} className="confirm-delete-button">Yes (Delete Review)</button>
                <button onClick={onCancel} className="cancel-delete-button">No (Keep Review)</button>
            </div>
        </div>
    );
};

export default DeleteReviewModal;
