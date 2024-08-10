const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')
const { requireAuth, authorization } = require('../../utils/auth');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');


router.get('/', async(req, res) => {
    let spots = await Spot.findAll({raw:true});

    for(const spot of spots){
        //calculating avg rating
        const sum = await Review.sum('stars', {where: { spotId:spot.id } })
        const count = await Review.count({ where: { spotId:spot.id } })
        if(count)
            spot.avgRating = sum/count
        else
            spot.avgRating = 'No reviews yet'

        //adding preview image if applicable
        const spotImage = await SpotImage.findOne({ raw:true, where: { spotId:spot.id, preview:true } })
        if(spotImage){
            spot.previewImage = spotImage.url
        }
        else
            spot.previewImage = 'No preview available'
    }
    return res.json({Spots:spots})
})

 
router.get('/current', 
    requireAuth, 
    async(req, res) => {
    const { user } = req;

    const userSpots = await Spot.findAll({ raw:true, where:{ ownerId:user.id} })
    console.log(userSpots);
    
    for(const spot of userSpots){
        //calculating avg rating
        const sum = await Review.sum('stars', {where: { spotId:spot.id } })
        const count = await Review.count({ where: { spotId:spot.id } })
        spot.avgRating = sum/count

        //adding preview image if applicable
        const spotImage = await SpotImage.findOne({ raw:true, where: { spotId:spot.id, preview:true } })
        if(spotImage){
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

router.put('/:spotId', 
    requireAuth,
    validateSpot,
    async (req, res, next) => {
        const spot = await Spot.findByPk(req.params.spotId)
        if(spot){
            const authorized = authorization(req, spot.ownerId);
            if(authorized !== true)
                return next(authorized)

            const { address, city, state, country, lat, lng, name, description, price} = req.body;
            spot.set({address, city, state, country, lat, lng, name, description, price});
            spot.save();
            return res.json(spot)

        }
        else{
            res.status(404);
            return res.json({message:"Spot couldn't be found"})
        }
})

router.delete('/:spotId',
    requireAuth,
    async (req, res, next) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if(spot){
            const authorized = authorization(req, spot.ownerId);
            if(authorized !== true)
                return next(authorized)

            spot.destroy();
            return res.json({message:'Successfully deleted'})
        }
        else{
            res.status(404);
            return res.json({message:"Spot couldn't be found"})
        }
    }
)

router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if(spot){
        const reviews = await Review.findAll({
            where: { spotId:req.params.spotId },
            include: [
               {model: User, attributes:['id', 'firstName', 'lastName']},
               {model: ReviewImage, attributes: ['id', 'url']}
            ]
           })
       if(reviews.length > 0)
           return res.json({Reviews:reviews})
       else{
           res.status(404)
           return res.json({message:"No reviews for this spot yet"})
       }
    }
    res.status(404)
    return res.json({message:"Spot couldn't be found"})
    
})

const validateReview = [
    check('review')
        .exists({checkFalsy:true})
        .isLength({ min:1, max: 600})
        .withMessage('Review text is required'),
    check('stars')
        .exists({ heckFalsy:true })
        .isInt({ min:1, max:5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

router.post('/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res) => {
        const spotId = req.params.spotId
        const spot = await Spot.findByPk(spotId)
        if(spot){
            const { user } = req;
            const userId = user.id
            const userReview = await Review.findOne({ 
                where: {
                    spotId:req.params.spotId,
                    userId
                }
            })
            if(userReview){
                res.status(500)
                return res.json({message:'User already has a review for this spot'})
            }
            const { review, stars } = req.body
            const newReview = await Review.create({ userId, spotId, review, stars})
            res.status(201)
            return res.json(newReview)
        }
        res.status(404)
        return res.json({message:"Spot couldn't be found"})
    }
)

router.get('/:spotId/bookings', 
    requireAuth,
    async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId)
        if(spot){
            if(spot.ownerId === req.user.id){
                const bookings = await Booking.findAll({
                    raw:true,
                    nest:true,
                    where:{ spotId:req.params.spotId },
                    include:{
                        model:User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                })
                return res.json({Bookings:bookings})
            }

            const bookings = await Booking.findAll({
                raw:true,
                nest:true,
                where:{ spotId:req.params.spotId },
                attributes: ['spotId', 'startDate', 'endDate']
            })

            return res.json({Bookings:bookings})
            
        }
        res.status(404)
        return res.json({message:"Spot couldn't be found"})
    }
)


module.exports = router