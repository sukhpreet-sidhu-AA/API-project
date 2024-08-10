const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')
const { requireAuth, authorization } = require('../../utils/auth');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', 
    requireAuth,
    async (req, res) => {
        const { user } = req
        const bookings = await Booking.findAll({
            raw: true,
            nest: true,
            where:{ userId:user.id },
            include:{ model:Spot, attributes:{ exclude: ['createdAt', 'updatedAt']}}
        })

        for(let booking of bookings){
            const spotImage = await SpotImage.findOne({ where: { spotId:booking.Spot.id, preview:true } })
            if(spotImage)
                booking.Spot.previewImage = spotImage.url
            else
                booking.Spot.previewImage = 'No preview available'
        }

        return res.json({Bookings:bookings})
    }
)



module.exports = router