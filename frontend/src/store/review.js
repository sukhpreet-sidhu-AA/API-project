import { csrfFetch } from "./csrf"
import { getSpotDetails } from "./spotDetails"

const GET_REVIEWS = 'review/getReviews'
const CLEAR_REVIEWS = 'review/clearReviews'

const loadReviews = (review) => {
    return {
        type: GET_REVIEWS,
        review
    }
}

const emptyReviews = () => {
    return {
        type: CLEAR_REVIEWS
    }
}

export const getReviews = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
        const data = await res.json()
        dispatch(loadReviews(data.Reviews))
    } catch(error) {
        console.log(await error.json());
        dispatch(emptyReviews())
    }
}

export const createReview = (spotId, review, stars) => async (dispatch) => {
    await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            review,
            stars
        })
    })
    dispatch(getReviews(spotId))
    dispatch(getSpotDetails(spotId))


}

const reviewReducer = (state = {}, action) => {
    switch(action.type){
        case GET_REVIEWS:{
            return {...action.review}
        }
        case CLEAR_REVIEWS: {
            return {}
        }
        default:
            return state
    }
}

export default reviewReducer