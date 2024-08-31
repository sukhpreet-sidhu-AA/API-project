import { useSelector } from "react-redux"

const ReviewList = () => {
    const reviewData = useSelector(state => state.reviews)
    const reviews = Object.values(reviewData)
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const reviewsReverse = reviews.toReversed();
    
    
    return (
        <div>
            {reviewsReverse.map(ele => (
                <div key={ele.id}>
                    <div>{ele.User.firstName}</div>
                    {/* <div>{new Date(ele.createdAt).toUTCString().slice(8,16)}</div> */}
                    <div>{month[parseInt(ele.createdAt.split('-')[1])-1]} {ele.createdAt.slice(0,4)}</div>
                    <p>{ele.review}</p>
                </div>
            ))}
        </div>
    )
}

export default ReviewList