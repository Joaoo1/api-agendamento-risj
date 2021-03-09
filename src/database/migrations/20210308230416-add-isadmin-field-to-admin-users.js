module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admin_users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('admin_users', 'is_admin');
  },
};
