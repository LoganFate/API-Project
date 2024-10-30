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
        url: '/HeightsPic.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1, // Replace with actual spot IDs
        url: '/KaraokePic.png',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1, // Replace with actual spot IDs
        url: '/RavensPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1, // Replace with actual spot IDs
        url: '/RunclubPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1, // Replace with actual spot IDs
        url: '/HtHwhiteOak.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/MidtownPic.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/KaraokePic.png',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/BillsPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/VTpic.png',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, // Replace with actual spot IDs
        url: '/HotOnes.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: '/WestuPic.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: '/OhioPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: '/MiamiPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, // Replace with actual spot IDs
        url: '/DetroitPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   spotId: 3, // Replace with actual spot IDs
      //   url: '/UFCpic.jpg',
      //   preview:false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/EnergycorridorPic.png',
        preview: true, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/JetsPic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/TAMpic.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/LiveMusicPic.png',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4, // Replace with actual spot IDs
        url: '/HtHenergy6.jpg',
        preview: false, // or false depending on your need
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   spotId: 5, // Replace with actual spot IDs
      //   url: '/Pulsar.png',
      //   preview: true, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 5, // Replace with actual spot IDs
      //   url: '/Pulsar2.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 5, // Replace with actual spot IDs
      //   url: '/Pulsar3.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 5, // Replace with actual spot IDs
      //   url: '/Pulsar4.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 5, // Replace with actual spot IDs
      //   url: '/Pulsar5.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 6, // Replace with actual spot IDs
      //   url: '/Quasar.png',
      //   preview: true, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 6, // Replace with actual spot IDs
      //   url: '/Quasar2.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 6, // Replace with actual spot IDs
      //   url: '/Quasar3.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 6, // Replace with actual spot IDs
      //   url: '/Quasar4.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 6, // Replace with actual spot IDs
      //   url: '/Quasar5.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 7, // Replace with actual spot IDs
      //   url: '/Nebula.png',
      //   preview: true, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 7, // Replace with actual spot IDs
      //   url: '/Nebula2.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 7, // Replace with actual spot IDs
      //   url: '/Nebula3.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 7, // Replace with actual spot IDs
      //   url: '/Nebula4.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 7, // Replace with actual spot IDs
      //   url: '/Nebula5.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 8, // Replace with actual spot IDs
      //   url: '/HorseHead.png',
      //   preview: true, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 8, // Replace with actual spot IDs
      //   url: '/HorseHead2.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 8, // Replace with actual spot IDs
      //   url: '/HorseHead3.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 8, // Replace with actual spot IDs
      //   url: '/HorseHead4.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 8, // Replace with actual spot IDs
      //   url: '/HorseHead5.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 9, // Replace with actual spot IDs
      //   url: '/Antennae.png',
      //   preview: true, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 9, // Replace with actual spot IDs
      //   url: '/Antennae2.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 9, // Replace with actual spot IDs
      //   url: '/Antennae3.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 9, // Replace with actual spot IDs
      //   url: '/Antennae4.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   spotId: 9, // Replace with actual spot IDs
      //   url: '/Antennae5.png',
      //   preview: false, // or false depending on your need
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
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
