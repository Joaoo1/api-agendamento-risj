import AppError from '../errors/AppError';

export default async (req, res, next) => {
  if (!req.query.date) {
    throw new AppError(400, 'Informe a data.');
  }

  return next();
};
