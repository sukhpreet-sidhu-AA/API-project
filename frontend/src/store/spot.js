import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spot/getAllSpots'
const DELETE_SPOT = 'spot/delete'

const loadSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

const spotDelete = (id) => {
    return{
        type: DELETE_SPOT,
        id
    }
}

export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const data = await res.json()
    dispatch(loadSpots(data.Spots))
}

export const createSpot = ({ address, city, state, country, name, description, price, images }) => async () => {
        const spotRes = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address,
                city,
                state,
                country,
                lat: 37.7645358,
                lng: -122.4730327,
                name,
                description,
                price: parseInt(price),
            })
        })

        const data = await spotRes.json();
        createSpotImage(images, data.id)
        return data.id
    
}

const createSpotImage = async (images, id) => {
    let count = 1;
    images.forEach(async (image) => {
        if (image) {
            await csrfFetch(`/api/spots/${id}/images`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: image,
                    preview: count === 1
                })
            }).then(count++)
        }
    });
}

export const updateSpot = ({ address, city, state, country, name, description, price }, id) => async () => {
        const res = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat: 37.7645358,
            lng: -122.4730327,
            name,
            description,
            price: parseInt(price)
        })
    })
    const data = await res.json();
    return data.id
}

export const getCurrentUserSpots = () => async (dispatch) => {
    
    const res = await csrfFetch('/api/spots/current')
    const data = await res.json();
    dispatch(loadSpots(data.Spots))
}

export const deleteSpot = (id) => async (dispatch) => {
    await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }

    })
    dispatch(spotDelete(id))
}

const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            return {...action.spots }
        }
        case DELETE_SPOT: {
            const temp = Object.values(state)
            const newState = temp.filter(ele => ele.id !== action.id)
            return newState
        }
        default:
            return state
    }
}

export default spotReducer