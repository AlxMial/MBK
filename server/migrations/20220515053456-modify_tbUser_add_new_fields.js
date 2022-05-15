"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
       queryInterface.addColumn(
        'tbUsers', // table name
        'addBy', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'tbUsers',
        'updateBy',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
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
