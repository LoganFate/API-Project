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
        userId: 3, // Random user ID
        spotId: 1,
        review: "The supernova experience was out of this world! The view was incredible, and the colors were unlike anything I've ever seen.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        spotId: 1,
        review: "An unforgettable cosmic journey. Witnessing a star's life cycle in such detail was truly awe-inspiring.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Reviews for Spots 2-7 (1 review each)
      {
        userId: 2,
        spotId: 2,
        review: "The event horizon of Sagittarius A* was mesmerizing. It felt like staring into the very fabric of space and time.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... Similar pattern for spots 3 through 7
      {
        userId: 4,
        spotId: 3,
        review: "Orion Nebula's vibrant colors took my breath away. A must-visit for anyone fascinated by the mysteries of space.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        spotId: 4,
        review: "Andromeda Galaxy was stunning. It's amazing to see another galaxy up close and personal!",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 6,
        spotId: 5,
        review: "Seeing the rhythmic pulsing of the Vela Pulsar is a unique experience. It's like a cosmic lighthouse!",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 9,
        spotId: 7,
        review: "Exploring the aftermath of a supernova in the Crab Nebula was surreal. The colors and patterns are extraordinary.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 8,
        spotId: 8,
        review: "Sailing through the Horsehead Nebula's dark clouds was a dream come true. The silhouette against the gas clouds is striking.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
