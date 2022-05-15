"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("tbPointCodeDTs", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointCodeDTs", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
