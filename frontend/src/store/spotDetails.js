import { csrfFetch } from "./csrf"

const GET_SPOT_DETAILS = 'spot/getSpotDetails'

const loadSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        spot
    }
}

export const getSpotDetails = (spotId) => async (dispatch) => {
    const spotRes = await csrfFetch(`/api/spots/${spotId}`)
    const spotData = await spotRes.json()
    dispatch(loadSpotDetails(spotData))
    
}

const spotDetailsReducer = (state = {}, action) => {
    switch(action.type){
        case GET_SPOT_DETAILS:{
            return {...action.spot}
        }

        default:
            return state
    }
}

export default spotDetailsReducer