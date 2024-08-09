const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User } = require('../../db/models')
const { requireAuth, authorization } = require('../../utils/auth');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.get('/', async(req, res) => {
    let spots = await Spot.findAll({raw:true});

    for(const spot of spots){
        //calculating avg rating
        const sum = await Review.sum('stars', {where: { spotId:spot.id } })
        const count = await Review.count({ where: { spotId:spot.id } })
        spot.avgRating = sum/count

        //adding preview image if applicable
        const spotImage = await SpotImage.findOne({ where: { spotId:spot.id } })
        if(spotImage.preview === true){
            spot.previewImage = spotImage.url
        }
        else
            spot.previewImage = 'No preview available'
    }
    return res.json({Spots:spots})
})

 
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userSpots = await Spot.findAll({ raw:true, where:{ ownerId:user.id} })
    console.log(userSpots);
    
    for(const spot of userSpots){
        //calculating avg rating
        const sum = await Review.sum('stars', {where: { spotId:spot.id } })
        const count = await Review.count({ where: { spotId:spot.id } })
        spot.avgRating = sum/count

        //adding preview image if applicable
        const spotImage = await SpotImage.findOne({ where: { spotId:spot.id } })
        if(spotImage.preview === true){
            spot.previewImage = spotImage.url
        }
        else
            spot.previewImage = 'No preview available'
    }

    return res.json({Spots:userSpots})
})

router.get('/:spotId', async (req, res) => {
    const spotDetails = await Spot.findOne({
        raw:true,
        where:{
            id:req.params.spotId
        }
    })

    if(spotDetails){
        // const plainSpotDetails = spotDetails.get({ plain: true });

        const sum = await Review.sum('stars', { where: { spotId:spotDetails.id } });
        const count = await Review.count({ where: { spotId:spotDetails.id } });
        spotDetails.numReviews = count;
        spotDetails.avgStarRating = sum/count;

        spotDetails.SpotImages = await SpotImage.findAll({ 
            where: { spotId:req.params.spotId },
            attributes:{exclude:['spotId','createdAt','updatedAt']}
        })
        spotDetails.Owner = await User.findOne(
            {where:{ id:spotDetails.ownerId},
            attributes:{exclude:['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']}}
        )
        return res.json(spotDetails);
    }
    else{
        res.status(404)
        return res.json({message: "Spot couldn't be found"})
    }

})

const validateSpot = [
    check("address")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:100 })
        .withMessage("Street address is required"),
    check("city")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:100 })
        .withMessage("City is required"),
    check("state")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:100 })
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:30 })
        .withMessage("Country is required"),
    check("lat")
        .exists({ checkFalsy:true })
        .isFloat({ min:-90, max:90})
        .withMessage("Latitude must be within -90 and 90"),
    check("lng")
        .exists({ checkFalsy:true })
        .isFloat({ min:-180, max:180})
        .withMessage("Longitude must be within -180 and 180"),
    check("name")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({ checkFalsy:true })
        .isLength({ min:1, max:120 })
        .withMessage("Description is required"),
    check("price")
        .exists({ checkFalsy:true })
        .isInt({ min:0 })
        .withMessage("Price per day must be a positive number"),
    handleValidationErrors
]

router.post('/', 
    requireAuth, 
    validateSpot, 
    async (req, res) => {
        const { user } = req;
        const ownerId = user.id
        const { address, city, state, country, lat, lng, name, description, price} = req.body;
        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price})
        res.status(201)
        return res.json(newSpot)
})

router.post('/:spotId/images', 
    requireAuth, 
    async (req, res, next) => {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if(spot){
            const authorized = authorization(req, spot.ownerId);
            if(authorized !== true) 
                return next(authorized)

            const { url, preview } = req.body;
            const newImage = await SpotImage.create({ spotId, url, preview })

            res.status(201);
            return res.json({
                id:newImage.id,
                url:newImage.url,
                preview:newImage.preview
            });
        }
        res.status(404);
        return res.json({message: "Spot couldn't be found"})

})

module.exports = router