import { ValidationError } from 'yup';

export default async (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const validationErrors = {};
    err.inner.forEach(error => {
      validationErrors[error.path] = error.message;
    });

    return res.status(400).json({
      errors: validationErrors,
      error: 'Validação falhou',
    });
  }

  const status = err.status || 500;
  const message = status === 500 ? err.message : err.message;
  return res.status(status).json({ error: message });
};
