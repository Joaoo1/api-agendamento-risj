import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        conclude: Sequelize.BOOLEAN,
        canceledAt: Sequelize.DATE,
        date: Sequelize.DATE,
        docNumber: Sequelize.STRING,
        services: Sequelize.ARRAY(Sequelize.STRING),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'cpf',
      targetKey: 'cpf',
      as: 'user',
    });

    this.belongsTo(models.AdminUser, {
      foreignKey: 'concludedBy',
      targetKey: 'id',
      as: 'adminUser',
    });
  }
}

export default Appointment;
