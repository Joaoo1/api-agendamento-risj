import jwt from 'jsonwebtoken';

import AdminUser from '../models/AdminUser';
import authConfig from '../../config/auth';

class StoreSessionService {
  async run({ login, password }) {
    const user = await AdminUser.findOne({
      where: { login },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (!(await user.checkPassword(password))) {
      throw new Error('Senhas inválida.');
    }

    return {
      token: jwt.sign({ id: user.id }, authConfig.secret),
      name: user.name,
    };
  }
}

export default new StoreSessionService();
