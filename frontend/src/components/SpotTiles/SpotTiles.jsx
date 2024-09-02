import { NavLink } from "react-router-dom"
import { IoIosStar } from "react-icons/io"
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import './SpotTiles.css'


const SpotTiles = ({ spotList, managed }) => {

    function sortSpots(a, b) {
        const aTime = a.updatedAt;
        const bTime = b.updatedAt;

        if (aTime > bTime)
            return -1
        if (aTime < bTime)
            return 1
        return 0
    }

    return (
        <div id="wrapper">
            <div id="tiles">
                {spotList.sort(sortSpots).map(({ id, avgRating, city, state, previewImage, price, name }) => (
                    <div key={id} className="tile">
                        <NavLink to={`/spots/${id}`} className='test' title={name}>
                            <div className="img-wrapper">
                                <img src={previewImage} alt="" className="img" />
                            </div>
                            <div>
                                <div className="star">
                                    <span>{city}, {state} </span>
                                    <span >
                                        <IoIosStar />
                                        <span> {avgRating === 'No reviews yet' || avgRating === null ? 'New' : (avgRating % 1 !== 0 ? Number.parseFloat(avgRating).toFixed(1) : `${avgRating}.0`)}</span>
                                    </span>

                                </div>
                                <div className="price">${price} night</div>

                            </div>
                        </NavLink>
                        {managed && (
                            <div id="update-delete">
                                <NavLink to={`/spots/${id}/edit`}><button id="update">Update</button></NavLink>
                                <OpenModalButton
                                    buttonText='Delete'
                                    modalComponent={<DeleteSpot id={id} />}
                                />
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpotTiles