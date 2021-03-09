import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class AdminUser extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        login: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        passwordHash: Sequelize.STRING,
        isAdmin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      /* Just execute it if password was informed,
        for example, on create user */
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default AdminUser;
