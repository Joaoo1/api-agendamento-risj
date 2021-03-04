import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        conclude: Sequelize.BOOLEAN,
        canceledAt: Sequelize.DATE,
        date: Sequelize.DATE,
        guia: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'cpf' });
  }
}

export default Appointment;
