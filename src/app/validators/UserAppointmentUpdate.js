import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    await schema.validate(req.params);

    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    return res.status(500).json({ error: err.message });
  }
};
