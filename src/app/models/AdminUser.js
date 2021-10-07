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

    this.addHook('beforeSave', async user => {
      if (user.password) {
        const passwordHash = await bcrypt.hash(user.password, 8);
        user.setDataValue('passwordHash', passwordHash);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default AdminUser;
