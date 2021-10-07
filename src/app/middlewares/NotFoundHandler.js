import AppError from '../errors/AppError';

export default (req, res, next) => {
  next(new AppError(404, 'Rota não encontrada'));
};
