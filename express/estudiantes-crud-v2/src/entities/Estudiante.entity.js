// La "entidad" representa la forma exacta de la fila en la tabla `estudiantes`.
// En Node no existe un ORM con clases mapeadas automáticamente como en
// Entity Framework, así que la entidad aquí cumple un rol más simple:
// darle una forma consistente al dato que sale de la base de datos,
// y evitar que filas "crudas" de MySQL viajen sin control por la app.
export class Estudiante {
  constructor({ id, nombre, curso }) {
    this.id = id;
    this.nombre = nombre;
    this.curso = curso;
  }

  // Mapea una fila devuelta por mysql2 hacia una instancia de Estudiante.
  static fromRow(row) {
    return new Estudiante({
      id: row.id,
      nombre: row.nombre,
      curso: row.curso,
    });
  }
}
