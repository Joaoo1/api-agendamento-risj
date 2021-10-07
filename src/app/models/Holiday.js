import Sequelize, { Model } from 'sequelize';

class Holiday extends Model {
  static init(sequelize) {
    super.init(
      {
        day: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Holiday;
