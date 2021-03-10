module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointments', 'concluded_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'admin_users', key: 'id' },
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('appointments', 'concluded_by');
  },
};
