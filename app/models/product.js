'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Warung, { foreignKey: 'warungId' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    image: DataTypes.JSON,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    warungId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Warungs',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};