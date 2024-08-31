
import { useModal } from "../../context/Modal"
import { IoIosStar } from "react-icons/io";
import './CreateReview.css'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../store/review";

const CreateReview = () => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const id = useSelector(state => state.spotDetails.id)
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(null)
    const [review, setReview] = useState('')
    const [errors, setErrors] = useState({})

    const submitHandler = (e) => {
        e.preventDefault();
        setErrors({})
        dispatch(createReview(id, review, rating))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.message)
                setErrors(data)
        })
        

    }

    useEffect(() => {
        const errors = {}
        
        if(rating === 0)
            errors.rating = true
        if(review.length < 10)
            errors.review = true

        setErrors(errors)

    }, [rating, review])

    return (
        <>
            <form className="reviewModal">
                <h2>How was your stay?</h2>
                {errors.message && (<div className="errors">{errors.message}</div>)}
                <textarea 
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave your review here..." 
                />
                <div id="starRating">
                    {[...Array(5)].map((ele, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label className="starLabel" key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onChange={() => setRating(ratingValue)}
                                />
                                <IoIosStar
                                    className="stars"
                                    color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            </label>
                        )
                    })}
                    <div id='starText'>Stars</div>
                </div>
                <button type='submit'  disabled={errors.review || errors.rating} onClick={submitHandler}>Submit Your Review</button>
            </form>
        </>

    )
}

export default CreateReview