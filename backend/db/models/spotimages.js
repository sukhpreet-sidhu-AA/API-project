'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImages.hasMany(models.Spot, { foreignKey:'spotId' })
    }
  }
  SpotImages.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    url: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isUrl:true
      }
    },
    preview:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'SpotImages',
  });
  return SpotImages;
};