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
        url: '/SuperNova.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/SagittariusA.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: '/Orion.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/Andromeda.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5, // Replace with actual spot IDs
        url: '/Pulsar.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 6, // Replace with actual spot IDs
        url: '/Quasar.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 7, // Replace with actual spot IDs
        url: '/Nebula.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 8, // Replace with actual spot IDs
        url: '/HorseHead.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 9, // Replace with actual spot IDs
        url: '/Antennae.png',
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
