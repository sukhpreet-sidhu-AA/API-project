import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../store/spotDetails";
import { getReviews } from "../../store/review";
import { useDispatch, useSelector } from "react-redux";
import ReviewInfo from "../ReviewInfo/ReviewInfo";
import ReviewList from "../ReviewList";
import CreateReview from "../CreateReview/CreateReview";
import OpenModalButton from "../OpenModalButton";

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spotDetails)
    const sessionUser = useSelector((state) => state.session.user);
    const reviewInfo = useSelector(state => state.reviews)
    const { name, city, state, country, Owner, SpotImages, price, description } = spotDetails
    let reviewed = false;
    console.log(reviewInfo);
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

    return (
        <div>
            <h1>{name}</h1>
            <h2>{city}, {state}, {country}</h2>
            <div>
                {SpotImages.map(ele => (
                <img key={ele.id} src={ele.url} alt="" />
            ))}
            </div>
            <div>
                <div>
                    <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
                    <p>{description}</p>
                </div>
                <div>
                    <div>
                        <div>${price} night</div>
                        <div>
                            <ReviewInfo spotDetails={spotDetails}/>
                        </div>
                    </div>
                    <button onClick={() => window.alert('Feature Coming Soon')}>Reserve</button>
                </div>
            </div>
            <div>
                <ReviewInfo spotDetails={spotDetails}/>
                {sessionUser && sessionUser.id !== spotDetails.Owner.id && !reviewed &&
                (<OpenModalButton 
                    buttonText='Post your Review'
                    modalComponent={<CreateReview />}
                />)}
                {Object.values(reviewInfo).length > 0 ? <ReviewList /> : (<p>Be the first to post a review!</p>)}
            </div>
        </div>
    )
}

export default SpotDetails