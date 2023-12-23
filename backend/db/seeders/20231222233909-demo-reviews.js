'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1, // Replace with actual spot IDs
        userId: 1, // Replace with actual user IDs
        review: 'Great place!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add 4 more review entries
      // {
      //   spotId: X,
      //   userId: Y,
      //   review: 'Your review',
      //   stars: Z,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    ], options);
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
