// Los DTOs describen y validan lo que ENTRA por el body del request.
// Son distintos de la entidad: la entidad es "cómo se ve el dato guardado",
// el DTO es "qué le permito al cliente enviarme". Aquí es donde detectas
// un id que el cliente no debería mandar, campos faltantes, tipos incorrectos, etc.

export class CreateEstudianteDTO {
  constructor({ nombre, curso }) {
    this.nombre = typeof nombre === 'string' ? nombre.trim() : nombre;
    this.curso = typeof curso === 'string' ? curso.trim() : curso;
  }

  validate() {
    const errores = [];

    if (!this.nombre || this.nombre.length === 0) {
      errores.push('nombre es requerido');
    } else if (this.nombre.length > 100) {
      errores.push('nombre no puede superar 100 caracteres');
    }

    if (!this.curso || this.curso.length === 0) {
      errores.push('curso es requerido');
    } else if (this.curso.length > 100) {
      errores.push('curso no puede superar 100 caracteres');
    }

    return errores;
  }
}

export class UpdateEstudianteDTO {
  constructor({ nombre, curso }) {
    this.nombre = typeof nombre === 'string' ? nombre.trim() : nombre;
    this.curso = typeof curso === 'string' ? curso.trim() : curso;
  }

  validate() {
    const errores = [];

    // En un update permitimos actualizar solo un campo, pero si viene,
    // debe ser válido.
    if (this.nombre !== undefined && this.nombre.length === 0) {
      errores.push('nombre no puede estar vacío');
    }
    if (this.curso !== undefined && this.curso.length === 0) {
      errores.push('curso no puede estar vacío');
    }
    if (this.nombre === undefined && this.curso === undefined) {
      errores.push('debes enviar al menos un campo (nombre o curso)');
    }

    return errores;
  }
}
