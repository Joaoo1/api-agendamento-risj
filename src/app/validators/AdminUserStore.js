import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
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
    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }

    return res.status(500).json({ error: err.message });
  }
};
