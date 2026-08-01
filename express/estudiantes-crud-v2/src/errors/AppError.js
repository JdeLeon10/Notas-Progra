// Errores de aplicación con su código HTTP asociado, para no repetir
// `res.status(...)` disperso en cada método del controlador.
// Es el mismo rol que cumpliría una excepción custom en C#
// (ej. NotFoundException) que luego capturas en un lugar central.

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(errores) {
    super('Error de validación', 400);
    this.errores = errores; // array de mensajes específicos
  }
}
