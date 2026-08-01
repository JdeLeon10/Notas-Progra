import express from 'express';
import estudianteRoutes from './routes/estudiante.routes.js';
import { AppError, ValidationError } from './errors/AppError.js';

export const app = express();

app.use(express.json());

app.use('/estudiantes', estudianteRoutes);

// Ruta no encontrada.
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Middleware de manejo de errores: debe ir al final y con 4 parámetros
// (Express lo reconoce como error-handler por esa firma).
// Es el equivalente al middleware/exception filter global de ASP.NET Core:
// un único lugar donde decides cómo se ve una respuesta de error.
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({ errores: error.errores });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ mensaje: error.message });
  }

  console.error('Error no controlado:', error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});
