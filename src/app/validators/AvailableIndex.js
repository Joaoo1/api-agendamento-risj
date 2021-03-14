export default async (req, res, next) => {
  if (!req.query.date) {
    return res.status(400).json({ error: 'Informe a data.' });
  }

  return next();
};
