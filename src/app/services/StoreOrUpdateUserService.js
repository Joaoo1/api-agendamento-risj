import User from '../models/User';

class StoreOrUpdateUserService {
  async run({ name, email, phone, cpf }) {
    const user = await User.findOne({ where: { cpf } });

    if (!user) {
      await User.create({ name, email, phone, cpf });
    } else {
      await user.update({ name, phone, email });
    }
  }
}

export default StoreOrUpdateUserService;
