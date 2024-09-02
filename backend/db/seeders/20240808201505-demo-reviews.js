'use strict';

const { Review } = require('../models')
let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId:1,
        userId:2,
        review:'Love the british!',
        stars:4,
      },
      {
        spotId:1,
        userId:3,
        review:'It was so cold.',
        stars:1,
      },
      {
        spotId:2,
        userId:1,
        review:'Its so white.',
        stars:3,
      },
      {
        spotId:2,
        userId:3,
        review:'I have a fear of heights.',
        stars:1,
      },
      {
        spotId:3,
        userId:1,
        review:'So peaceful here.',
        stars:4,
      },
      {
        spotId:3,
        userId:2,
        review:'Not big on nature personally.',
        stars:1,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    })
  }
};
