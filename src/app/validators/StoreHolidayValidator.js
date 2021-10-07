import * as Yup from 'yup';
import { dateRegex } from './utils/date';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    date: Yup.string()
      .required('Insira uma data')
      .matches(dateRegex, 'Data inválida'),
  });

  req.body = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  return next();
};
