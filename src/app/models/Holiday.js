import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

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
