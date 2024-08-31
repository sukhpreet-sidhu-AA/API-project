import { useSelector } from "react-redux"
import { IoIosStar } from "react-icons/io";
import './ReviewInfo.css'

const ReviewInfo = ({ spotDetails }) => {
    const reviewInfo = useSelector(state => state.reviews)
    const { avgStarRating } = spotDetails
    
    if(!reviewInfo[0]){
        return (
            <div>
                <IoIosStar />
                <div>New</div>
            </div>
        )
    }
    
    else{
        const reviewCount = Object.values(reviewInfo).length;
        return (
            <div className="review-Info">
                <IoIosStar />
                <div>{avgStarRating % 1 !== 0 ? avgStarRating : `${avgStarRating}.0`}</div>
                <div> · </div>
                <div>{reviewCount === 1 ? `${reviewCount} review` : `${reviewCount} reviews`}</div>
            </div>
        )
    }        

}

export default ReviewInfo