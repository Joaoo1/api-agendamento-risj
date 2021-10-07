import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Informe o nome'),
    login: Yup.string()
      .trim()
      .min(5, 'O login precisa ter no minímo 5 digítos')
      .required('Insira o login'),
    password: Yup.string().min(8).required('Insira a senha'),
    confirmPassword: Yup.string()
      .required('Insira a confirmação da senha')
      .oneOf([Yup.ref('password')], 'Senhas não conferem'),
    isAdmin: Yup.bool(),
  });

  req.body = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  return next();
};
