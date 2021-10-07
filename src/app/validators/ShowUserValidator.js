import * as Yup from 'yup';
import { cpfRegex } from './utils/cpf';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    cpf: Yup.string()
      .required('Insira um CPF.')
      .matches(cpfRegex, 'CPF inválido.'),
  });

  req.body = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  return next();
};
