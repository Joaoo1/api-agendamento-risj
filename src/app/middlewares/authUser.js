import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import AppError from '../errors/AppError';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, 'Token não informado.');
  }

  // Authorization comes in format "Bearer token...",
  // so split it to get only the token
  const [, token] = authHeader.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = id;

    return next();
  } catch (err) {
    throw new AppError(401, 'Token inválido.');
  }
};
