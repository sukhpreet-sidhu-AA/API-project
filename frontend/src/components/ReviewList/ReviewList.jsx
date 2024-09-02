import { useSelector } from "react-redux"
import OpenModalButton from "../OpenModalButton"
import DeleteReview from "../DeleteReview/DeleteReview"
import './ReviewList.css'

const ReviewList = () => {
    const reviewData = useSelector(state => state.reviews)
    const user = useSelector(state => state.session.user)
    const { id } = {...user}
    const reviews = Object.values(reviewData)
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const reviewsSorted = reviews.sort(sortReviews)

    function sortReviews (a, b){
        const aTime = a.updatedAt;
        const bTime = b.updatedAt;

        if(aTime > bTime)
            return -1
        if(aTime < bTime)
            return 1
        return 0
    }
    

    return (
        <div>
            {reviewsSorted.map(ele => (
                <div className="reviews" key={ele.id}>
                    <div id="name">{ele.User.firstName}</div>
                    {/* <div>{new Date(ele.createdAt).toUTCString().slice(8,16)}</div> */}
                    <div className="date">{month[parseInt(ele.createdAt.split('-')[1])-1]} {ele.createdAt.slice(0,4)}</div>
                    <p>{ele.review}</p>
                    {id === ele.User.id && (<OpenModalButton 
                        buttonText='Delete'
                        modalComponent={<DeleteReview id={ele.id} spotId={ele.spotId}/>}
                    />)}
                </div>
            ))}
        </div>
    )
}

export default ReviewList
