'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Destinations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gmaps: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shortdeskripsi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      longdeskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.JSON, // Array untuk menyimpan link gambar
        allowNull: true,
      },
      fasilitas: {
        type: Sequelize.JSON, // Array untuk menyimpan fasilitas
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Destinations');
  }
};
