import * as Yup from 'yup';
import AdminUser from '../models/AdminUser';

const AvailableController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Informe o nome'),
      login: Yup.string()
        .trim()
        .min(5, 'O login precisa ter no minímo 5 digítos')
        .required('Insira o login'),
      password: Yup.string().min(8).required('Insira a senha'),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required('Insira a confirmação da senha')
              .oneOf([Yup.ref('password')], 'Senhas não conferem')
          : field
      ),
      isAdmin: Yup.bool(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ errors: err.errors });
      }

      return res.status(500).json({ error: err.message });
    }

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
