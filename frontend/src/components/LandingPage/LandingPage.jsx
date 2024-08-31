import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import './Landing.css'
import { NavLink } from "react-router-dom";
import { IoIosStar } from "react-icons/io";

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots)
    const spotList = Object.values(spots)
    
    useEffect(() => {
        const result = dispatch(getAllSpots())
        result.then(res => console.log(res));
    }, [dispatch])

    return (
        <>
        {spotList.toReversed().map(({ id, avgRating, city, state, previewImage, price, name}) => (
            <NavLink key={id} to={`/spots/${id}`} className='test' title={name}>
                <img src={previewImage} alt="" />
                 <div>
                     <div>
                         <span>{city}, {state} </span>
                         <span>
                            <IoIosStar />
                            <span>{avgRating === 'No reviews yet' ? 'New' : (avgRating % 1 !== 0 ? avgRating : `${avgRating}.0`)}</span>
                         </span>
                         
                     </div>
                     <div>${price} night</div>
                 </div>
            </NavLink>
        ))}
        </>
    )

}

export default LandingPage