import { useEffect, useState } from "react"
import './CreateSpot.css'
import { createSpot} from "../../store/spot"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { updateSpot } from "../../store/spot"

const CreateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {spotId} = useParams()
    const spotsData = useSelector(state => state.spots)
    const spots = Object.values(spotsData)
    
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const [errors, setErrors] = useState({})

    const title = spotId ? (<h1>Update Your Spot</h1>) : (<h1>Create a New Spot</h1>)
    const spotToUpdate = spots.find(({ id }) => id === parseInt(spotId))
        

    useEffect(() => {
        if(spotId){
            setCountry(spotToUpdate.country)
            setAddress(spotToUpdate.address)
            setCity(spotToUpdate.city)
            setState(spotToUpdate.state)
            setDescription(spotToUpdate.description)
            setName(spotToUpdate.name)
            setPrice(spotToUpdate.price)
        } else {
            setCountry('')
            setAddress('')
            setCity('')
            setState('')
            setDescription('')
            setName('')
            setPrice('')
        }
        
    }, [spotId, spotToUpdate])

    

    const submitHandler = (e) => {
        e.preventDefault();
        const errors = {}
        if (country.length === 0)
            errors.country = true
        if (address.length === 0)
            errors.address = true
        if (city.length === 0)
            errors.city = true
        if (state.length === 0)
            errors.state = true
        if (description.length < 30)
            errors.description = true
        if (name.length === 0)
            errors.name = true
        if (isNaN(price))
            errors.price = true
        if(!spotId){
            if (previewImage.length === 0)
                errors.previewImage = true
            if (image1.length > 0 && endsWith(image1))
                errors.image1 = true            
            if (image2.length > 0 && endsWith(image2))
                errors.image2 = true        
            if (image3.length > 0 && endsWith(image3))
                errors.image3 = true        
            if (image4.length > 0 && endsWith(image4))
                errors.image4 = true
        }
        

        setErrors(errors)
        
        const images = [previewImage, image1, image2, image3, image4]

        if(!Object.keys(errors).length) {
            const newSpot ={
                address,
                city,
                state,
                country,
                name,
                description,
                price,
                images
            }
            let result

            if(spotId) {result = dispatch(updateSpot(newSpot, spotId))}

            else {result = dispatch(createSpot(newSpot))}

            result.then(res => {
                console.log(res);
                navigate(`/spots/${res}`)
            })
                
            
        }
    }

    const endsWith = (url) => {
        let value = true;
        if(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))
            value = false

        return value
    }


    return (
        <>
            {title}
            <h2>Where&apos;s your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form className="createSpotForm">
                <div>
                    <label className="createSpotLabel">
                        Country
                        <input
                            type="text"
                            name="country"
                            value={country}
                            placeholder="Country"
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        {errors.country && (<div className="errors">Country is required</div>)}
                    </label>
                    <label className="createSpotLabel">
                        Address
                        <input
                            type="text"
                            name="address"
                            value={address}
                            placeholder="Address"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {errors.address && (<div className="errors">Address is required</div>)}
                    </label>
                    <label className="createSpotLabel">
                        City
                        <input
                            type="text"
                            name="city"
                            value={city}
                            placeholder="City"
                            onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.city && (<div className="errors">City is required</div>)}
                    </label>
                    <label className="createSpotLabel">
                        State
                        <input
                            type="text"
                            name="state"
                            value={state}
                            placeholder="State"
                            onChange={(e) => setState(e.target.value)}
                        />
                        {errors.state && (<div className="errors">State is required</div>)}
                    </label>
                </div>
                <div>
                    <h2>Describe your place to your guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <label className="createSpotLabel">
                        Description
                        <input
                            type="text"
                            name="description"
                            value={description}
                            placeholder="Please write at least 30 characters"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && (<div className="errors">Description needs a minimum of 30 characters</div>)}
                    </label>
                </div>
                <div>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <label className="createSpotLabel">
                        Name
                        <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Name of your spot"
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (<div className="errors">Name is required</div>)}
                    </label>
                </div>
                <div>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label className="createSpotLabel">
                        Price
                        <input
                            type="text"
                            name="price"
                            value={price}
                            placeholder="Price per night (USD)"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && (<div className="errors">Price is required</div>)}
                    </label>
                </div>
                {!spotId && (
                    <div>
                    <label className="createSpotLabel">
                        <h2>Liven up your spot with photos</h2>
                        <p>Submit a link to at least one photo to publish your spot</p>
                        <input
                            type="text"
                            name="previewImage"
                            value={previewImage}
                            placeholder="Preview Image URL"
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        {errors.previewImage && (<div className="errors">Preview image is required</div>)}
                        
                        <input 
                            type="text"
                            name="image1"
                            value={image1}
                            placeholder="Image URL"
                            onChange={(e) => setImage1(e.target.value)}  
                        />
                        {errors.image1 && (<div className="errors">Image URL must end in .png, .jpg. jpeg</div>)}
                        <input 
                            type="text"
                            name="image2"
                            value={image2}
                            placeholder="Image URL"
                            onChange={(e) => setImage2(e.target.value)}  
                        />
                        {errors.image2 && (<div className="errors">Image URL must end in .png, .jpg. jpeg</div>)}
                        <input 
                            type="text"
                            name="image3"
                            value={image3}
                            placeholder="Image URL"
                            onChange={(e) => setImage3(e.target.value)}  
                        />
                        {errors.image3 && (<div className="errors">Image URL must end in .png, .jpg. jpeg</div>)}
                        <input 
                            type="text"
                            name="image4"
                            value={image4}
                            placeholder="Image URL"
                            onChange={(e) => setImage4(e.target.value)}  
                        />
                        {errors.image4 && (<div className="errors">Image URL must end in .png, .jpg. jpeg</div>)}





                    </label>
                </div>
                )}
                
                <button
                    type="submit"
                    onClick={submitHandler}>
                    {spotId ? 'Update your Spot' : 'Create Spot'}
                </button>
            </form>

        </>
    )
}

export default CreateSpot