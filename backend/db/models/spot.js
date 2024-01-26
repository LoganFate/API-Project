'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // Define associations here
      // Example: this.belongsTo(models.User, { foreignKey: 'ownerId' });
          // Association with Review
          Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE' });
          // Association with SpotImage
          Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', as: 'previewImage', onDelete: 'CASCADE' });
          Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', as: 'SpotImages', onDelete: 'CASCADE' });
          Spot.belongsTo(models.User, {foreignKey: 'ownerId', as: 'Owner', onDelete: 'CASCADE' });
          Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE' });
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
      allowNull: true
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true
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
