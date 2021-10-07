import * as Yup from 'yup';
import AppError from '../errors/AppError';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    login: Yup.string().required(),
    password: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    throw new AppError(400, 'Usuário e/ou senha incorretos');
  }

  return next();
};
