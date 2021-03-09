import AdminUser from '../models/AdminUser';

export default async (req, res, next) => {
  const { isAdmin } = await AdminUser.findByPk(req.userId);

  if (isAdmin) {
    return next();
  }

  return res
    .status(401)
    .json({ error: 'Você não tem permissão para fazer isso.' });
};
