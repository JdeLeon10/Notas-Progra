import {
  listarEstudiantes,
  obtenerEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
} from '../services/estudiante.service.js';

// El controlador solo hace tres cosas: lee el request, llama al servicio,
// y traduce el resultado (o el error) a una respuesta HTTP.
// Ya no construye SQL ni decide manualmente el status code de cada error;
// eso lo delega al middleware de errores vía next(error).

export async function getEstudiantes(req, res, next) {
  try {
    const estudiantes = await listarEstudiantes();
    res.json(estudiantes);
  } catch (error) {
    next(error);
  }
}

export async function getEstudianteById(req, res, next) {
  try {
    const estudiante = await obtenerEstudiantePorId(req.params.id);
    res.json(estudiante);
  } catch (error) {
    next(error);
  }
}

export async function createEstudiante(req, res, next) {
  try {
    const nuevoEstudiante = await crearEstudiante(req.body);
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    next(error);
  }
}

export async function updateEstudiante(req, res, next) {
  try {
    const estudianteActualizado = await actualizarEstudiante(req.params.id, req.body);
    res.json(estudianteActualizado);
  } catch (error) {
    next(error);
  }
}

export async function deleteEstudiante(req, res, next) {
  try {
    await eliminarEstudiante(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
