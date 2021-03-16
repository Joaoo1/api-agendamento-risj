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

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default Holiday;
