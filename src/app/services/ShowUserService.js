import User from '../models/User';

class ShowUserService {
  async run({ cpf }) {
    const user = await User.findOne({
      where: { cpf },
      attributes: ['cpf', 'name', 'phone', 'email'],
    });

    return user || {};
  }
}

export default new ShowUserService();
