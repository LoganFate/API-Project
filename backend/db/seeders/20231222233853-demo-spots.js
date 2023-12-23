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
      {
        ownerId: 2,  // Replace with actual user IDs
        address: '777 Random Avenue',
        city: 'Baltimore',
        state: 'MD',
        country: 'United States',
        lat: 456.789,
        lng: -456.789,
        name: 'Demo Spot 2',
        description: 'A very beautiful demo spot',
        price: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
