import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    schedule: Yup.string()
      .required('Insira o horário')
      .matches(/^\d{2}:\d{2}/, 'Horário inválido'),
  });

  req.body = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  return next();
};
