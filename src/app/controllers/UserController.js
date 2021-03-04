import * as Yup from 'yup';

import User from '../models/User';

const UserController = {
  async show(req, res) {
    const schema = Yup.object().shape({
      cpf: Yup.string()
        .required('Insira um CPF;')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido.' }),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json(err.errors);
      }

      return res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }

    const user = await User.findOne({ where: { cpf: req.params.cpf } });

    return res.json(user || {});
  },
};

export default UserController;
