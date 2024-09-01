import { useDispatch, useSelector } from "react-redux"
import SpotTiles from "../SpotTiles/SpotTiles";
import { useEffect } from "react";
import { getCurrentUserSpots } from "../../store/spot";
import { NavLink } from "react-router-dom";

const ManageSpots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotList = Object.values(spots)
    let content;

    useEffect(() => {
        dispatch(getCurrentUserSpots())
    }, [dispatch])

    if(spotList.length > 0)
        content = (<SpotTiles spotList={spotList} managed={true}/>)
    else
        content = (<NavLink to='/spots/new'><button>Create New Spot</button></NavLink>)
    
    return (
        <>
            <h1>Manage Spots</h1>
            {content}
        </>
        
        
    )
}

export default ManageSpots