import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      cpf: Yup.string()
        .required('Insira um CPF.')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido.' }),
    });
    await schema.validate(req.params);

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.errors[0] });
    }

    return res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
};
