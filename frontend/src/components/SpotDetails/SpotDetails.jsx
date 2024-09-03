import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../store/spotDetails";
import { getReviews } from "../../store/review";
import { useDispatch, useSelector } from "react-redux";
import ReviewInfo from "../ReviewInfo/ReviewInfo";
import ReviewList from "../ReviewList";
import CreateReview from "../CreateReview/CreateReview";
import OpenModalButton from "../OpenModalButton";
import './SpotDetails.css'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spotDetails)
    const sessionUser = useSelector((state) => state.session.user);
    const reviewInfo = useSelector(state => state.reviews)
    const { name, city, state, country, Owner, SpotImages, price, description } = spotDetails
    let reviewed = false;
    let count = 0;

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
        dispatch(getReviews(spotId))
    }, [dispatch, spotId])

    if (!spotDetails || !SpotImages) {
        return <div>Loading...</div>;
    }

    if(sessionUser)
        Object.values(reviewInfo).forEach(ele => {
            if(sessionUser.id === ele.userId)
                reviewed = true
        })

    const photos = SpotImages.map(ele => {count++; return (
        <img key={ele.id} id={ele.preview ? count-- && 'main' : `img${count}`} src={ele.url} alt="" />
    )})
    return (
        <div id="spot-details">
            <div>
            <h1>{name}</h1>
            <h2>{city}, {state}, {country}</h2>
            <div id="grid">
                {photos}
            </div>
            <div id="info-bar">
                <div id="info">
                    <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
                    <p>{description}</p>
                </div>
                <div id="price-bar">
                    <div id="price-reviews">
                        <div>${price} night</div>
                        <div >
                            <ReviewInfo spotDetails={spotDetails}/>
                        </div>
                    </div>
                    <button id="reserve" onClick={() => window.alert('Feature Coming Soon')}>Reserve</button>
                </div>
            </div>
            <div className="test">
                <ReviewInfo spotDetails={spotDetails}/>
                <div className="small">
                {sessionUser && sessionUser.id !== spotDetails.Owner.id && !reviewed &&
                (<OpenModalButton 
                    buttonText='Post your Review'
                    modalComponent={<CreateReview />}
                />)}
                {Object.values(reviewInfo).length > 0 ? <ReviewList /> : (<p>Be the first to post a review!</p>)}
                </div>
            </div>
            </div>
        </div>
    )
}

export default SpotDetails