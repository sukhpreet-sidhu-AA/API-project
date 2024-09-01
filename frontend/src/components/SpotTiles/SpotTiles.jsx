import { NavLink } from "react-router-dom"
import { IoIosStar } from "react-icons/io"
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";


const SpotTiles = ({spotList, managed}) => {

    function sortSpots (a, b){
        const aTime = a.updatedAt;
        const bTime = b.updatedAt;

        if(aTime > bTime)
            return -1
        if(aTime < bTime)
            return 1
        return 0
    }

    return (
        <>
        {spotList.sort(sortSpots).map(({ id, avgRating, city, state, previewImage, price, name}) => (
            <div key={id}>
            <NavLink  to={`/spots/${id}`} className='test' title={name}>
                <img src={previewImage} alt="" />
                 <div>
                     <div>
                         <span>{city}, {state} </span>
                         <span>
                            <IoIosStar />
                            <span>{avgRating === 'No reviews yet' || avgRating === null ? 'New' : (avgRating % 1 !== 0 ? Number.parseFloat(avgRating).toFixed(1) : `${avgRating}.0`)}</span>
                         </span>
                         
                     </div>
                     <div>${price} night</div>
                     
                 </div>
            </NavLink>
            {managed && (
                    <div>
                        <NavLink to={`/spots/${id}/edit`}><button>Update</button></NavLink>
                        <OpenModalButton
                            buttonText='Delete'
                            modalComponent={<DeleteSpot id={id}/>}
                        />
                    </div>
                 )}
            
            </div>
        ))}
        </>
    )
}

export default SpotTiles