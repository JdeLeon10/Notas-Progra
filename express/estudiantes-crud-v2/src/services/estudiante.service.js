import { pool } from '../config/db.js';
import { Estudiante } from '../entities/Estudiante.entity.js';
import { CreateEstudianteDTO, UpdateEstudianteDTO } from '../dtos/Estudiante.dto.js';
import { NotFoundError, ValidationError } from '../errors/AppError.js';

// El servicio concentra las reglas de negocio y el acceso a datos.
// El controlador ya no sabe nada de SQL, del pool ni de mysql2:
// solo llama a estas funciones y traduce el resultado (o el error) a HTTP.

export async function listarEstudiantes() {
  const [rows] = await pool.query('SELECT id, nombre, curso FROM estudiantes');
  return rows.map(Estudiante.fromRow);
}

export async function obtenerEstudiantePorId(id) {
  const [rows] = await pool.query(
    'SELECT id, nombre, curso FROM estudiantes WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError(`Estudiante con id ${id} no encontrado`);
  }

  return Estudiante.fromRow(rows[0]);
}

export async function crearEstudiante(datos) {
  const dto = new CreateEstudianteDTO(datos);
  const errores = dto.validate();

  if (errores.length > 0) {
    throw new ValidationError(errores);
  }

  const [result] = await pool.query(
    'INSERT INTO estudiantes (nombre, curso) VALUES (?, ?)',
    [dto.nombre, dto.curso]
  );

  return new Estudiante({ id: result.insertId, nombre: dto.nombre, curso: dto.curso });
}

export async function actualizarEstudiante(id, datos) {
  const dto = new UpdateEstudianteDTO(datos);
  const errores = dto.validate();

  if (errores.length > 0) {
    throw new ValidationError(errores);
  }

  const campos = [];
  const valores = [];

  if (dto.nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(dto.nombre);
  }
  if (dto.curso !== undefined) {
    campos.push('curso = ?');
    valores.push(dto.curso);
  }
  valores.push(id);

  const [result] = await pool.query(
    `UPDATE estudiantes SET ${campos.join(', ')} WHERE id = ?`,
    valores
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError(`Estudiante con id ${id} no encontrado`);
  }

  return obtenerEstudiantePorId(id);
}

export async function eliminarEstudiante(id) {
  const [result] = await pool.query('DELETE FROM estudiantes WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new NotFoundError(`Estudiante con id ${id} no encontrado`);
  }
}
