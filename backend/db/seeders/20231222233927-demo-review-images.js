'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1, // Replace with actual review IDs
        url: '/SuperNova.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 2, // Replace with actual review IDs
        url: 'http://example.com/review-image-2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 3, // Replace with actual review IDs
        url: 'http://example.com/review-image-3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 4, // Replace with actual review IDs
        url: 'http://example.com/review-image-4.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 5, // Replace with actual review IDs
        url: 'http://example.com/review-image-5.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Adjust the condition to match the records you want to delete
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
