'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, { foreignKey:'spotId' })
      Booking.belongsTo(models.User, { foreignKey:'userId' })
    }
  }
  Booking.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    startDate: {
      type:DataTypes.DATE,
      allowNull:false,
      // validate:{
      //   isAfter: new Date().toISOString().split('T')[0],
      //   msg:'start date must be a future date'
      // }
    },
    endDate: {
      type:DataTypes.DATE,
      allowNull:false,
      // validate:{
      //   isAfter: this.startDate,
      //   msg:'end date must be after the start date'
      // }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};