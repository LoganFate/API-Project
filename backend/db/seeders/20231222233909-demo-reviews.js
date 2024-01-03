'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1, // Replace with actual spot IDs
        userId: 1, // Replace with actual user IDs
        review: 'Great place!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        userId: 2, // Replace with actual user IDs
        review: 'Not so great place!',
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        userId: 3, // Replace with actual user IDs
        review: 'It was alright.',
        stars: 3.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        userId: 4, // Replace with actual user IDs
        review: 'Amazing, but a lot of noise when trying to sleep at night.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5, // Replace with actual spot IDs
        userId: 5, // Replace with actual user IDs
        review: 'The worst place in the entire universe.',
        stars: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Adjust the condition to match the records you want to delete
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
