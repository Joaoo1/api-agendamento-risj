import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import AdminUser from '../models/AdminUser';
import authConfig from '../../config/auth';

const SessionController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const { login, password } = req.body;

    const user = await AdminUser.findOne({
      where: { login },
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senhas inválida.' });
    }

    return res.status(200).json({
      token: jwt.sign({ id: user.id }, authConfig.secret),
      name: user.name,
    });
  },
};

export default SessionController;
