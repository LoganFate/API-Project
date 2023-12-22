'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,  // Replace with actual user IDs
        address: '123 Demo Street',
        city: 'Demoville',
        state: 'DS',
        country: 'Demo Country',
        lat: 123.456,
        lng: -123.456,
        name: 'Demo Spot 1',
        description: 'A lovely demo spot',
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add 4 more spot entries
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }  // Adjust as per the IDs used
    }, {});
  }
};
