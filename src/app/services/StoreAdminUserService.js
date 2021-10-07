import AppError from '../errors/AppError';
import AdminUser from '../models/AdminUser';

class StoreAdminUserService {
  async run({ name, login, password, confirmPassword, isAdmin }) {
    const userExists = await AdminUser.findOne({
      where: { login },
    });

    if (userExists) {
      throw new AppError(409, 'Esse login já está em uso');
    }

    const adminUser = await AdminUser.create({
      name,
      login,
      password,
      confirmPassword,
      isAdmin,
    });

    return { name: adminUser.name, login: adminUser.login };
  }
}

export default new StoreAdminUserService();
