'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,  // Replace with actual user IDs
        address: 'NGC 5461',
        city: 'Pinwheel Galaxy',
        state: 'Dimension C137',
        country: 'Central Finite Curve',
        lat: 54.777,
        lng: -57.492,
        name: 'SN 2023ixf',
        description: 'The nearest known supernova to our earth...',
        price: 114979,
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
        ownerId: 3,
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
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }  // Adjust as per the IDs used
    }, {});
  }
};
