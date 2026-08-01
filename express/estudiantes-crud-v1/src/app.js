import express from 'express';
import estudianteRoutes from './routes/estudiante.routes.js';

export const app = express();

app.use(express.json());

app.use('/estudiantes', estudianteRoutes);

// Manejo de rutas no encontradas.
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});
