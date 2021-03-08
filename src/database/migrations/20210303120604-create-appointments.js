module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cpf: {
        type: Sequelize.STRING(14),
        allowNull: false,
        references: { model: 'users', key: 'cpf' },
        onUpdate: 'CASCADE',
      },
      doc_number: {
        type: Sequelize.STRING,
      },
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      conclude: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      canceled_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointments');
  },
};
