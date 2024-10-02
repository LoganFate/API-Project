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
        city: '2820 White Oak Dr',
        state: 'Houston, TX 77007',
        country: 'Local Group',
        lat: 54.777,
        lng: -57.492,
        name: 'The Heights',
        description: 'Experience the awe-inspiring sight of a supernova in real-time, a rare and illuminating cosmic event offering spectacular views of stellar life cycles.',
        price:'Heights',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: 'Sagittarius A*',
        city: '2000 Bagby St #105/106',
        state: 'Houston, TX 77002',
        country: 'Observable Universe',
        lat: -29.007,
        lng: -17.464,
        name: 'Midtown',
        description: 'Witness the mesmerizing dance of light around the edge of a black hole.',
        price: 'Midtown',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: 'Orion Nebula',
        city: '5114 Kirby Dr',
        state: 'Houston, TX 77098',
        country: 'Local Group',
        lat: -5.391,
        lng: 5.909,
        name: 'West U',
        description: 'A vibrant display of cosmic gas and dust formations.',
        price: 'West U',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 4,
        address: 'Andromeda Galaxy',
        city: '1010 Hwy 6',
        state: 'Houston, TX 77079',
        country: 'Virgo Supercluster',
        lat: 41.269,
        lng: -74.969,
        name: 'Energy Corridor',
        description: 'Journey to the bustling center of our neighboring galaxy.',
        price: 'Energy Corridor',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // {
      //   ownerId: 5,
      //   address: 'Vela Pulsar',
      //   city: 'Vela Constellation',
      //   state: 'Milky Way Galaxy',
      //   country: 'Local Bubble',
      //   lat: -45.176,
      //   lng: 19.775,
      //   name: 'Cosmic Lighthouse',
      //   description: 'Experience the rhythmic pulses of a neutron star.',
      //   price: 120000,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 6,
      //   address: '3C 273',
      //   city: 'Virgo Constellation',
      //   state: 'Local Supercluster',
      //   country: 'Observable Universe',
      //   lat: 2.052,
      //   lng: 12.447,
      //   name: 'Brightest Beacon',
      //   description: 'Observe one of the most luminous quasars known to exist.',
      //   price: 210000,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 7,
      //   address: 'Crab Nebula',
      //   city: 'Taurus Constellation',
      //   state: 'Milky Way Galaxy',
      //   country: 'Local Group',
      //   lat: 22.001,
      //   lng: 59.601,
      //   name: 'Stellar Remains',
      //   description: 'Explore the aftermath of a supernova explosion.',
      //   price: 115000,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 1,
      //   address: 'Horsehead Nebula',
      //   city: 'Orion Constellation',
      //   state: 'Milky Way Galaxy',
      //   country: 'Local Arm',
      //   lat: -2.398,
      //   lng: 24.183,
      //   name: 'Cosmic Silhouette',
      //   description: 'Sail through the iconic dark nebula shaped like a horse’s head.',
      //   price: 105000,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 9,
      //   address: 'Antennae Galaxies',
      //   city: 'Corvus Constellation',
      //   state: 'Deep Space',
      //   country: 'Observable Universe',
      //   lat: -18.879,
      //   lng: -21.759,
      //   name: 'Cosmic Clash',
      //   description: 'Observe the spectacular merging of two galaxies.',
      //   price: 250000,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }



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
