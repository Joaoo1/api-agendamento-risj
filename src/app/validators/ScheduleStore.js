import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      schedule: Yup.string()
        .required('Insira o horário')
        .matches(/^\d{2}:\d{2}/, { message: 'Horário inválido' }),
    });
    await schema.validate(req.body);

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.errors[0] });
    }

    return res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
};
