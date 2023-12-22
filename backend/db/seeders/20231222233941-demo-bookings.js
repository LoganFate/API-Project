'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1, // Replace with actual spot IDs
        userId: 1, // Replace with actual user IDs
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add 4 more booking entries
      // {
      //   spotId: X,
      //   userId: Y,
      //   startDate: new Date(),
      //   endDate: new Date(new Date().setDate(new Date().getDate() + Z)),
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    ], options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Adjust the condition to match the records you want to delete
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
