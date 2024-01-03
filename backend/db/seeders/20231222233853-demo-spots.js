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
        ownerId: 2,  // Replace with actual user IDs
        address: '123 Demo Street',
        city: 'Demoville',
        state: 'DS',
        country: 'Demo Country',
        lat: 23.456,
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
        lat: 56.789,
        lng: -56.789,
        name: 'Demo Spot 2',
        description: 'A very beautiful demo spot',
        price: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: '1756 Silk Road',
        city: 'Manhattan',
        state: 'New York',
        country: 'United States',
        lat: 56.148,
        lng: -30.419,
        name: 'Demo Spot 3',
        description: 'An absolutely magnificent demo spot',
        price: 3000,
        createdAt: new Date(),
        updatedAt: new Date
      },
      {
      ownerId: 4,
      address: '8936 Random Spot Drive',
      city: 'NoName',
      state: 'UK',
      country: 'Great Britain',
      lat: 67.184,
      lng: -86.629,
      name: 'Demo Spot 4',
      description: 'No one knows of this spot, very secluded',
      price: 500,
      createdAt: new Date(),
      updatedAt: new Date
      },
      { ownerId: 5,
        address: '97346 Johnson St',
        city: 'Cambridge',
        state: 'New York',
        country: 'United States',
        lat: 37.159,
        lng: -37.145,
        name: 'Demo Spot 5',
        description: 'A man named John Johnson lived here',
        price: 250,
        createdAt: new Date(),
        updatedAt: new Date
      }
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
