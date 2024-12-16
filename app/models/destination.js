'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Destination.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    gmaps: DataTypes.STRING,
    shortdeskripsi: DataTypes.STRING,
    longdeskripsi: DataTypes.TEXT,
    image: DataTypes.JSON, // Simpan sebagai array JSON
    fasilitas: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Destination',
  });
  return Destination;
};