import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spot/getAllSpots'



const loadSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const data = await res.json()
    dispatch(loadSpots(data.Spots))
}

export const createSpot = ({ address, city, state, country, name, description, price, images }) => async () => {
    try {
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
    } catch (error) {
        console.log(await error.json());
    }
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


const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            return { ...state, ...action.spots }
        }

        default:
            return state
    }
}

export default spotReducer