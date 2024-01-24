
import './ManageSpots.css'


const ConfirmDeleteModal = ({ spotName, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove the spot &quot;{spotName}&quot;?</p>
            <div className="confirmation-buttons">
                <button onClick={onConfirm} className="confirm-delete-button">Yes (Delete Spot)</button>
                <button onClick={onCancel} className="cancel-delete-button">No (Keep Spot)</button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
