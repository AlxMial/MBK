"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("tbMembers", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbMembers", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbMemberPoints", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbMemberPoints", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointCodeHDs", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointCodeHDs", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointCodeDTs", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointCodeDTs", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointRegisters", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointRegisters", "updateBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointStoreHDs", "addBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("tbPointStoreDTs", "updateBy", {
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
