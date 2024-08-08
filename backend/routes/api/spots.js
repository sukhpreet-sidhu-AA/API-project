const express = require('express');
const router = express.Router();
const { Spot, Review, SpotImage } = require('../../db/models')
const { Op } = require('sequelize');

router.get('/', async(req,res) => {
    let spots = await Spot.findAll();

    for(const spot of spots){
        //calculating avg rating
        const sum = await Review.sum('stars', {where: { spotId:spot.id } })
        const count = await Review.count({ where: { spotId:spot.id } })
        spot.dataValues.avgRating = sum/count

        //adding preview image if applicable
        const spotImage = await SpotImage.findOne({ where: { spotId:spot.id } })
        if(spotImage.dataValues.preview === true){
            spot.dataValues.previewImage = spotImage.dataValues.url
        }
        else
            spot.dataValues.previewImage = 'No preview available'
    }
    return res.json({Spots:spots})
})


module.exports = router