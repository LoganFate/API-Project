'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-1.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-2.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-3.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-4.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-5.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Adjust the condition to match the records you want to delete
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
