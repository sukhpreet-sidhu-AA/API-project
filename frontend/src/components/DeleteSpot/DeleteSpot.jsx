import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spot";

const DeleteSpot = ({id}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteSpot(id))
        closeModal()
    }
    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={() => handleDelete()}>Yes (Delete Spot)</button>
            <button onClick={() => closeModal()}>No (Keep Spot)</button>
        </>

    )
}

export default DeleteSpot