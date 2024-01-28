'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'Demo'
      },
      {
        email: 'RickyRick@RandM.com',
        username: 'Wubulubbadubdub',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Rick',
        lastName: 'Sanchez'
      },
      {
        email: 'Morty@adventures.com',
        username: 'AwJeez',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Morty',
        lastName: 'Smith'
      },
      {
        email: 'Meseeks@box.com',
        username: 'MrMeseeks',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Mr.Meseeks',
        lastName: 'Meseeks'
      },
      {
        email: 'Squanchy@party.com',
        username: 'SquanchySquanch',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Squanchy',
        lastName: 'Squanch'
      },
      {
        email: 'Birdperson@phoenixperson.com',
        username: 'BirdPerson',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: 'Bird',
        lastName: 'Person'
      },
      {
        email: 'EvilMorty@citadel.com',
        username: 'EvilMorty',
        hashedPassword: bcrypt.hashSync('password7'),
        firstName: 'Evil',
        lastName: 'Morty'
      },
      {
        email: 'Jerry@unemployed.com',
        username: 'JerryJamboree',
        hashedPassword: bcrypt.hashSync('password8'),
        firstName: 'Jerry',
        lastName: 'Smith'
      },
      {
        email: 'Beth@horsehospital.com',
        username: 'SpaceBeth',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Beth',
        lastName: 'Smith'
      },

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4'] }
    }, {});
  }
};
