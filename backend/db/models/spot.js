'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // Define associations here
      // Example: this.belongsTo(models.User, { foreignKey: 'ownerId' });
    }
  }

  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Add references if you are establishing associations
      // references: {
      //   model: 'Users',
      //   key: 'id'
      // }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });

  return Spot;
};