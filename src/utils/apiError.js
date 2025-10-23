class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // Chama o construtor de Error, definindo a 'message'
    this.statusCode = statusCode;
    this.isOperational = true; // Indica que este é um erro 'esperado' (do cliente ou operacional)
    Error.captureStackTrace(this, this.constructor); // Mantém o stack trace limpo
  }
}

// 400 Bad Request: Erro de validação ou dados incorretos
class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

// 404 Not Found: Recurso não encontrado
class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

// 409 Conflict: Erro de unicidade
class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

// 403 Forbidden: Usuário autenticado, mas sem permissão
class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError, // Adicione aqui
};
