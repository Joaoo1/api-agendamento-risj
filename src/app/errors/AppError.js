class AppError {
  constructor(statusCode = 400, message) {
    this.status = statusCode;
    this.message = message;
  }
}

export default AppError;
