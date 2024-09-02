'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage, sequelize } = require('../models')
let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url:'https://i.pinimg.com/originals/3f/6b/62/3f6b627f6153df183f4602a50c1146e4.jpg',
        preview:true,
      },
      {
        spotId:1,
        url:'https://i.pinimg.com/originals/b7/a1/52/b7a1521812b3f04aa35745cad9a41727.png',
        preview:false,
      },
      {
        spotId:1,
        url:'https://i.pinimg.com/originals/e6/3d/b7/e63db77d07846cfa3b428dad5124420e.jpg',
        preview:false,
      },
      {
        spotId:1,
        url:'https://i.pinimg.com/originals/1f/2a/33/1f2a33c3b06d7fdd1672ac98e6b13588.jpg',
        preview:false,
      },
      {
        spotId:2,
        url:'https://static.wikia.nocookie.net/lotr/images/e/e4/Minas_Tirith.jpg',
        preview:true,
      },
      {
        spotId:2,
        url:'https://i.pinimg.com/originals/6f/ec/d2/6fecd288b1aaf86a3c1598cb1178ff70.jpg',
        preview:false,
      },
      {
        spotId:3,
        url:'https://i.pinimg.com/originals/9b/1f/33/9b1f33e11976066af409585cbbd0d5a3.jpg',
        preview:true,
      },
      {
        spotId:3,
        url:'https://i.pinimg.com/originals/2a/d9/d7/2ad9d76807cb2a1451d3cd8f4ffa5f82.jpg',
        preview:false,
      },
      {
        spotId:3,
        url:'https://i.pinimg.com/originals/60/20/f6/6020f6facf49aa64059102e8a11018dc.jpg',
        preview:false,
      },
      {
        spotId:4,
        url:'https://i.pinimg.com/originals/55/11/e2/5511e200f3f13c647ea32e7182d25a25.jpg',
        preview:true,
      },
      {
        spotId:4,
        url:'https://i.pinimg.com/originals/1e/1e/64/1e1e647605d02b9294dff9a1f7c8bcc5.jpg',
        preview:false,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4]}
    })
  }
};
