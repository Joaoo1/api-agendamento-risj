import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        schedule: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Schedule;
