module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointments', 'canceled_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'admin_users', key: 'id' },
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('appointments', 'canceled_by');
  },
};
