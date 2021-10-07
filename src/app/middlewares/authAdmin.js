import AdminUser from '../models/AdminUser';
import AppError from '../errors/AppError';

export default async (req, res, next) => {
  const { isAdmin } = await AdminUser.findByPk(req.userId);

  if (isAdmin) {
    return next();
  }

  throw new AppError(401, 'Acesso negado');
};
