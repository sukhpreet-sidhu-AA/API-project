
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/review";

const DeleteReview = ({id, spotId}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    
    const handleDelete = () => {
        dispatch(deleteReview(id, spotId))
        closeModal()
    }
    return (
        <div id="delete-page">
            <h2 className="delete-text">Confirm Delete</h2>
            <p className="delete-text">Are you sure you want to delete this review?</p>
            <button className="buttonText" id="delete" onClick={() => handleDelete()}>Yes (Delete Review)</button>
            <button className="buttonText" id="keep" onClick={() => closeModal()}>No (Keep Review)</button>
        </div>

    )
}

export default DeleteReview