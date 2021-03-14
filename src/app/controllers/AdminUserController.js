import AdminUser from '../models/AdminUser';

const AvailableController = {
  async store(req, res) {
    const userExists = await AdminUser.findOne({
      where: { login: req.body.login },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Esse login já está em uso' });
    }

    const { name, login } = await AdminUser.create(req.body);

    return res.status(201).json({ name, login });
  },
};

export default AvailableController;
