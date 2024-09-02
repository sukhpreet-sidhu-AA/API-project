
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/review";

const DeleteReview = ({id, spotId}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    console.log(id, spotId);
    const handleDelete = () => {
        dispatch(deleteReview(id, spotId))
        closeModal()
    }
    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={() => handleDelete()}>Yes (Delete Review)</button>
            <button onClick={() => closeModal()}>No (Keep Review)</button>
        </div>

    )
}

export default DeleteReview