import { pool } from '../config/db.js';
import { Estudiante } from '../entities/Estudiante.entity.js';
import { CreateEstudianteDTO, UpdateEstudianteDTO } from '../dtos/Estudiante.dto.js';

// GET /estudiantes
export async function getEstudiantes(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nombre, curso FROM estudiantes');
    const estudiantes = rows.map(Estudiante.fromRow);
    res.json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener estudiantes' });
  }
}

// GET /estudiantes/:id
export async function getEstudianteById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT id, nombre, curso FROM estudiantes WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: `Estudiante con id ${id} no encontrado` });
    }

    res.json(Estudiante.fromRow(rows[0]));
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener el estudiante' });
  }
}

// POST /estudiantes
export async function createEstudiante(req, res) {
  try {
    const dto = new CreateEstudianteDTO(req.body);
    const errores = dto.validate();

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const [result] = await pool.query(
      'INSERT INTO estudiantes (nombre, curso) VALUES (?, ?)',
      [dto.nombre, dto.curso]
    );

    const nuevoEstudiante = new Estudiante({
      id: result.insertId,
      nombre: dto.nombre,
      curso: dto.curso,
    });

    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno al crear el estudiante' });
  }
}

// PUT /estudiantes/:id
export async function updateEstudiante(req, res) {
  try {
    const { id } = req.params;
    const dto = new UpdateEstudianteDTO(req.body);
    const errores = dto.validate();

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    // Construimos el UPDATE dinámicamente solo con los campos enviados.
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
      return res.status(404).json({ mensaje: `Estudiante con id ${id} no encontrado` });
    }

    const [rows] = await pool.query(
      'SELECT id, nombre, curso FROM estudiantes WHERE id = ?',
      [id]
    );

    res.json(Estudiante.fromRow(rows[0]));
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar el estudiante' });
  }
}

// DELETE /estudiantes/:id
export async function deleteEstudiante(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM estudiantes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `Estudiante con id ${id} no encontrado` });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar el estudiante' });
  }
}
