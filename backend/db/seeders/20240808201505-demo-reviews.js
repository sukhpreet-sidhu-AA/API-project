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
        review:'It was great',
        stars:5,
      },
      {
        spotId:1,
        userId:3,
        review:'It was average',
        stars:3,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['It was great', 'It was average'] }
    })
  }
};
