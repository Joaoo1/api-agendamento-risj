import User from '../models/User';

const UserController = {
  async show(req, res) {
    const user = await User.findOne({
      where: { cpf: req.params.cpf },
      attributes: ['cpf', 'name', 'phone', 'email'],
    });

    return res.json(user || {});
  },
};

export default UserController;
