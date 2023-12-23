'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1, // Replace with actual spot IDs
        url: 'http://example.com/spot-image-1.jpg',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add 4 more spot image entries
      // {
      //   spotId: X,
      //   url: 'http://example.com/spot-image-X.jpg',
      //   preview: true or false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    ], options);
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
