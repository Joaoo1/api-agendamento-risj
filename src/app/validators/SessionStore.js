import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    login: Yup.string().required(),
    password: Yup.string().required(),
  });

  // Don't show any specific error to difficult any invasor attempt
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validação falhou.' });
  }

  return next();
};
