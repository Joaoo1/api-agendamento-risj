import jwt from 'jsonwebtoken';

import AdminUser from '../models/AdminUser';
import authConfig from '../../config/auth';
import AppError from '../errors/AppError';

class StoreSessionService {
  async run({ login, password }) {
    const user = await AdminUser.findOne({
      where: { login },
    });

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado.');
    }

    if (!(await user.checkPassword(password))) {
      throw new AppError(400, 'Senhas inválida.');
    }

    return {
      token: jwt.sign({ id: user.id }, authConfig.secret),
      name: user.name,
    };
  }
}

export default new StoreSessionService();
