'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1, // Replace with actual review IDs
        url: 'http://example.com/review-image-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add 4 more review image entries
      // {
      //   reviewId: X,
      //   url: 'http://example.com/review-image-X.jpg',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    ], options);
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
