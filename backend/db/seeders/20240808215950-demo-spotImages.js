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
        url:'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465200_0q7Of6UnbA8kDlYEe3a4PuIyue27fbuV.jpg',
        preview:true,
      },
      {
        spotId:1,
        url:'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465200_0q7Of6UnbA8kDlYEe3a4PuIyue27fbuV.jpg',
        preview:false,
      },
      {
        spotId:1,
        url:'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465200_0q7Of6UnbA8kDlYEe3a4PuIyue27fbuV.jpg',
        preview:false,
      },
      {
        spotId:2,
        url:'https://as1.ftcdn.net/v2/jpg/01/57/36/74/1000_F_157367489_FSqP231EvpCB9fqD5s5PhCp8MOuEcfih.jpg',
        preview:true,
      },
      {
        spotId:3,
        url:'https://as2.ftcdn.net/v2/jpg/02/86/74/59/1000_F_286745923_V0bdu4fC53WuBvC5FyP8jxgIizs77DLT.jpg',
        preview:true,
      },
      {
        spotId:4,
        url:'https://cdn.onekindesign.com/wp-content/uploads/2019/10/Traditional-English-Manor-House-Jauregui-Architect-01-1-Kindesign.jpg',
        preview:true,
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
