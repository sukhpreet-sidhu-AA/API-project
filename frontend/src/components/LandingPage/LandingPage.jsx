import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import './Landing.css'
import SpotTiles from "../SpotTiles/SpotTiles";

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots)
    const spotList = Object.values(spots)
    
    useEffect(() => {
        dispatch(getAllSpots())
        
    }, [dispatch])

    return (
        <div id="wrapper">
            <SpotTiles spotList={spotList}/>
        </div>
        
    )

}

export default LandingPage