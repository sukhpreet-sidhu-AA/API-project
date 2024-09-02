'use strict';

const { Spot } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId:1,
        address:'Hogwarts Castle',
        city:'Highlands',
        state:'Scotland',
        country: 'Great Britain',
        lat: 34.052235,
        lng:-118.243683,
        name:'Hogwarts Castle',
        description:'A huge, seven-story building with many towers, turrets, staircases, and full of magic',
        price: 100.00
      },
      {
        ownerId:2,
        address:'Eastern Edge',
        city:'Mount Mindolluin',
        state:'White Mountains',
        country:'Middle Earth',
        lat:37.773972,
        lng:-122.431297,
        name: 'Minas Tirith',
        description:'Minas Tirith is a city and fortress in the land of Middle-earth that serves as the capital of Gondor',
        price: 200.00
      },
      {
        ownerId:3,
        address: 'Bruinen River gorge',
        city: 'Western slope of Misty Mountains',
        state: 'Eastern Eriador',
        country: 'Middle Earth',
        lat: 37.335278,
        lng: -121.891944,
        name: 'Rivendell',
        description: 'A sanctuary, a magical Elvish otherworld, and a fortress.',
        price: 300.00
      },
      {
        ownerId:4,
        address: '1234 test address',
        city: 'Anywhere',
        state: 'Everywhere',
        country: 'Ingary',
        lat: 37.335278,
        lng: -121.891944,
        name: 'Howls Moving Castle',
        description: 'Tall, off-balanced, black-brick castle with four square towers, and three doors',
        price: 200.00
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1,2,3,4] }
    }, {})
  }
};
