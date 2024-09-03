import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spot";
import './DeleteSpot.css'

const DeleteSpot = ({id}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteSpot(id))
        closeModal()
    }
    return (
        <div id="delete-page">
            <h2 className="delete-text">Confirm Delete</h2>
            <p className="delete-text">Are you sure you want to remove this spot?</p>
            <button className="buttonText" id="delete" onClick={() => handleDelete()}>Yes (Delete Spot)</button>
            <button className="buttonText" id="keep" onClick={() => closeModal()}>No (Keep Spot)</button>
        </div>

    )
}

export default DeleteSpot