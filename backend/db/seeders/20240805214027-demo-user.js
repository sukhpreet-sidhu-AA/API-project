'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'Demo',
        lastName: 'Lition',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'aElessar@user.io',
        firstName: 'Aragorn',
        lastName: 'Elessar',
        username: 'Arg1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'elrond@user.io',
        firstName: 'Elrond',
        lastName: 'Peredhel',
        username: 'Elrond',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'howl@user.io',
        firstName: 'Howl',
        lastName: 'Pendragon',
        username: 'Howl-P',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'Arg1', 'Elrond', 'Howl-P'] }
    }, {});
  }
};

