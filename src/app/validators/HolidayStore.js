import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      date: Yup.string()
        .required('Insira uma data')
        .matches(
          // Matches dates on format DD/MM/YYYY
          /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
          'Data inválida'
        ),
    });
    await schema.validate(req.body);

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.errors[0] });
    }

    return res.status(500).json({ error: err.message });
  }
};
