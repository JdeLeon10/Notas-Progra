# SQL Server

## Conceptos basicos

### Base de datos

Una base de datos almacena informacion organizada en tablas. En SQL Server se trabaja normalmente seleccionando primero la base de datos activa con `USE`.

```sql
CREATE DATABASE CursoSQLServer;
USE CursoSQLServer;
```

Para eliminar una base de datos:

```sql
DROP DATABASE CursoSQLServer;
```

### Entidad

Una entidad es un objeto, concepto o dato que queremos representar de forma agrupada. En una base de datos suele convertirse en una tabla.

### Tabla

Una tabla agrupa registros en filas y columnas.

Ejemplo de tabla `users`:

```sql
CREATE TABLE users (
    users_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL,
    age INT NULL,
    email VARCHAR(100) NULL
);
```

Detalles importantes:

- `PRIMARY KEY`: identifica cada fila de forma unica.
- `IDENTITY(1,1)`: genera numeros automaticos empezando en 1 e incrementando de 1 en 1.
- `NOT NULL`: obliga a que el campo tenga valor.
- `NULL`: permite que el campo no tenga valor.
- `VARCHAR(50)`: texto de hasta 50 caracteres.

## Tipos de datos comunes

Antes de crear tablas conviene elegir bien el tipo de dato de cada columna. El tipo define que valores se pueden guardar, cuanto espacio ocupan y que operaciones puedes hacer con ellos.

### Numericos

| Tipo | Uso comun | Ejemplo |
| ---- | --------- | ------- |
| `INT` | Numeros enteros | `age INT` |
| `BIGINT` | Enteros muy grandes | `views BIGINT` |
| `DECIMAL(p, s)` | Numeros exactos con decimales | `price DECIMAL(10, 2)` |
| `FLOAT` | Numeros aproximados con decimales | `measurement FLOAT` |

Ejemplo:

```sql
CREATE TABLE products (
    product_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);
```

`DECIMAL(10, 2)` significa hasta 10 digitos en total, con 2 digitos despues del punto decimal. Es mejor que `FLOAT` para dinero porque evita aproximaciones.

### Texto

| Tipo | Uso comun | Ejemplo |
| ---- | --------- | ------- |
| `CHAR(n)` | Texto de longitud fija | `country_code CHAR(2)` |
| `VARCHAR(n)` | Texto de longitud variable | `email VARCHAR(100)` |
| `VARCHAR(MAX)` | Texto largo | `description VARCHAR(MAX)` |
| `NCHAR(n)` | Texto Unicode de longitud fija | `code NCHAR(2)` |
| `NVARCHAR(n)` | Texto Unicode de longitud variable | `name NVARCHAR(100)` |

Usa `NVARCHAR` si necesitas guardar caracteres especiales o multiples idiomas. Usa `VARCHAR` cuando sabes que el texto sera simple y quieres ahorrar espacio.

### Fechas y horas

| Tipo | Uso comun | Ejemplo |
| ---- | --------- | ------- |
| `DATE` | Solo fecha | `birth_date DATE` |
| `TIME` | Solo hora | `start_time TIME` |
| `DATETIME2` | Fecha y hora precisa | `created_at DATETIME2` |

Ejemplo:

```sql
CREATE TABLE events (
    event_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

`SYSDATETIME()` devuelve la fecha y hora actual del servidor con buena precision.

### Booleanos

SQL Server usa `BIT` para valores tipo verdadero/falso.

```sql
CREATE TABLE settings (
    settings_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    notifications_enabled BIT NOT NULL DEFAULT 1
);
```

Valores comunes:

- `1`: verdadero.
- `0`: falso.
- `NULL`: desconocido o no definido, si la columna permite `NULL`.

### Identificadores unicos

`UNIQUEIDENTIFIER` guarda valores tipo GUID/UUID.

```sql
CREATE TABLE api_keys (
    api_key_id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    name VARCHAR(100) NOT NULL,
    CONSTRAINT pk_api_keys PRIMARY KEY (api_key_id)
);
```

Se usa cuando necesitas identificadores globalmente unicos, aunque para tablas simples suele bastar con `INT IDENTITY`.

### Recomendaciones rapidas

- Usa `INT IDENTITY` para claves primarias simples.
- Usa `VARCHAR(n)` o `NVARCHAR(n)` con un limite razonable, no siempre `MAX`.
- Usa `DECIMAL` para dinero o calculos exactos.
- Usa `DATETIME2` para fechas con hora.
- Usa `BIT` para valores de verdadero/falso.
- Evita guardar numeros como texto si despues necesitaras ordenarlos o calcular con ellos.

## Creacion de tablas

### Tabla con restricciones

```sql
CREATE TABLE person (
    person_id INT NOT NULL IDENTITY(1,1),
    person_name VARCHAR(50) NOT NULL,
    person_email VARCHAR(100) NULL,
    person_age INT NULL,
    CONSTRAINT uq_person_name UNIQUE (person_name),
    CONSTRAINT pk_person PRIMARY KEY (person_id),
    CONSTRAINT chk_person_age CHECK (person_age IS NULL OR person_age >= 18)
);
```

Restricciones comunes:

- `PRIMARY KEY`: clave primaria.
- `UNIQUE`: evita valores repetidos en una columna o combinacion de columnas.
- `CHECK`: valida una condicion antes de insertar o actualizar.
- `DEFAULT`: asigna un valor por defecto si no se especifica.
- `FOREIGN KEY`: crea una relacion con otra tabla.

Ejemplo con `DEFAULT`:

```sql
CREATE TABLE products (
    product_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    active BIT NOT NULL DEFAULT 1
);
```

### Eliminar tablas

```sql
DROP TABLE products;
```

> `DROP TABLE` elimina la tabla y sus datos. Para borrar solo filas se usa `DELETE` o `TRUNCATE`.

## Insercion de datos

```sql
INSERT INTO users (name, age, email)
VALUES
    ('Usuario 1', 36, 'usuario1@example.com'),
    ('Usuario 2', 23, 'usuario2@example.com'),
    ('Usuario 3', NULL, 'usuario3@example.com'),
    ('Usuario 4', 21, 'usuario4@example.com');
```

Notas:

- Usa `NULL`, no texto como `'null'`, cuando quieras representar ausencia de valor.
- Si ejecutas varias veces el mismo `INSERT`, se duplicaran los datos salvo que exista una restriccion que lo impida.
- Para agregar una nueva columna o modificar estructura, crea una instruccion nueva con `ALTER TABLE` en lugar de reejecutar todo el script de insercion.

## Consultas basicas

### SELECT

`SELECT` permite consultar datos de una tabla. Puedes pedir todas las columnas con `*` o solo las columnas que necesitas.

```sql
SELECT * FROM users;
SELECT name FROM users;
SELECT name, email FROM users;
```

Ejemplo de resultado para `SELECT * FROM users;`:

| users_id | name      | age  | email                | country   |
| -------- | --------- | ---- | -------------------- | --------- |
| 1        | Usuario 1 | 36   | usuario1@example.com | España    |
| 2        | Usuario 2 | 23   | usuario2@example.com | Guatemala |
| 3        | Usuario 3 | NULL | usuario3@example.com | Guatemala |
| 4        | Usuario 4 | 21   | usuario4@example.com | Mexico    |

Ejemplo de resultado para `SELECT name FROM users;`:

| name      |
| --------- |
| Usuario 1 |
| Usuario 2 |
| Usuario 3 |
| Usuario 4 |

Ejemplo de resultado para `SELECT name, email FROM users;`:

| name      | email                |
| --------- | -------------------- |
| Usuario 1 | usuario1@example.com |
| Usuario 2 | usuario2@example.com |
| Usuario 3 | usuario3@example.com |
| Usuario 4 | usuario4@example.com |

### DISTINCT

`DISTINCT` elimina valores repetidos del resultado. No modifica los datos guardados en la tabla, solo cambia lo que devuelve la consulta.

Es util cuando quieres ver una lista de valores unicos, por ejemplo todas las edades registradas sin repetir o todos los paises existentes en `users`.

```sql
SELECT DISTINCT age FROM users;
SELECT DISTINCT country FROM users;
```

Ejemplo de resultado para `SELECT DISTINCT age FROM users;`:

| age  |
| ---- |
| 36   |
| 23   |
| NULL |
| 21   |

Ejemplo de resultado para `SELECT DISTINCT country FROM users;`:

| country   |
| --------- |
| España    |
| Guatemala |
| Mexico    |

Observa que `Guatemala` aparece dos veces en la tabla original, pero con `DISTINCT` solo aparece una vez.

### WHERE

Filtra filas segun una condicion.

```sql
SELECT * FROM users WHERE age = 40;
SELECT DISTINCT age FROM users WHERE age = 40;
```

### ORDER BY

Ordena resultados.

```sql
SELECT * FROM users ORDER BY age;
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC;
```

### TOP

Limita la cantidad de filas devueltas.

```sql
SELECT TOP 3 * FROM users;
```

### Alias con AS

```sql
SELECT name AS nombre FROM users;
SELECT MAX(age) AS edad_maxima FROM users;
```

## Filtros y operadores

### LIKE

Busca patrones de texto.

```sql
SELECT * FROM users WHERE country LIKE 'G%';
SELECT * FROM users WHERE email LIKE '%@example.com';
SELECT * FROM users WHERE email LIKE 'usuario%@example.com';
```

Patrones comunes:

- `'G%'`: empieza con `G`.
- `'%example%'`: contiene `example`.
- `'%@example.com'`: termina en `@example.com`.

### NOT

```sql
SELECT * FROM users WHERE email NOT LIKE '%@example.com';
```

### AND

Todas las condiciones deben cumplirse.

```sql
SELECT *
FROM users
WHERE age = 23
  AND email LIKE '%@example.com';
```

### OR

Al menos una condicion debe cumplirse.

```sql
SELECT *
FROM users
WHERE email LIKE 'usuario%@example.com'
   OR email LIKE 'admin%@example.com';
```

### IN

Busca coincidencias dentro de una lista.

```sql
SELECT * FROM users WHERE name IN ('Usuario 2', 'Usuario 3');
```

### BETWEEN

Busca valores dentro de un rango inclusivo.

```sql
SELECT * FROM users WHERE age BETWEEN 20 AND 25;
```

### NULL

`NULL` no se compara con `=`. Se usa `IS NULL` o `IS NOT NULL`.

```sql
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;
```

## Funciones utiles

### Agregacion

```sql
SELECT MAX(age) AS edad_maxima FROM users;
SELECT MIN(age) AS edad_minima FROM users;
SELECT SUM(age) AS suma_edades FROM users;
SELECT AVG(age) AS promedio_edad FROM users;
```

### CONCAT

```sql
SELECT CONCAT('Usuario: ', name, ' - Email: ', email) AS contacto
FROM users;
```

### CASE

Permite crear condiciones dentro de una consulta.

```sql
SELECT
    name,
    age,
    CASE
        WHEN age >= 18 THEN 'Mayor de edad'
        WHEN age IS NULL THEN 'Edad pendiente'
        ELSE 'Menor de edad'
    END AS estado_edad
FROM users;
```

### ISNULL

Sustituye valores `NULL` por un valor por defecto al consultar.

```sql
SELECT
    name,
    ISNULL(email, 'PENDIENTE') AS email,
    ISNULL(age, 0) AS age
FROM users;
```

Ejemplo de datos originales:

| name      | email                | age  |
| --------- | -------------------- | ---- |
| Usuario 1 | usuario1@example.com | 36   |
| Usuario 2 | NULL                 | 23   |
| Usuario 3 | usuario3@example.com | NULL |
| Usuario 4 | usuario4@example.com | 21   |

Resultado usando `ISNULL`:

| name      | email                | age |
| --------- | -------------------- | --- |
| Usuario 1 | usuario1@example.com | 36  |
| Usuario 2 | PENDIENTE            | 23  |
| Usuario 3 | usuario3@example.com | 0   |
| Usuario 4 | usuario4@example.com | 21  |

En este ejemplo, `ISNULL(email, 'PENDIENTE')` muestra `PENDIENTE` cuando `email` es `NULL`, e `ISNULL(age, 0)` muestra `0` cuando `age` es `NULL`. La tabla original no cambia; solo cambia el resultado de la consulta.

## Modificacion de datos y estructura

### UPDATE

```sql
UPDATE users
SET email = 'usuario2@example.com'
WHERE users_id = 2;
```

Actualizar varias columnas:

```sql
UPDATE users
SET age = 24,
    email = 'nuevo@example.com'
WHERE users_id = 7;
```

> Siempre usa `WHERE` en `UPDATE`, salvo que realmente quieras actualizar todas las filas.

### DELETE

```sql
DELETE FROM users WHERE users_id IN (4, 5, 6);
```

> Siempre usa `WHERE` en `DELETE`, salvo que realmente quieras borrar todas las filas.

### ALTER TABLE

Agregar columna:

```sql
ALTER TABLE users ADD country VARCHAR(50) NULL;
```

Eliminar columna:

```sql
ALTER TABLE users DROP COLUMN nationality;
```

Renombrar columna:

```sql
EXEC sp_rename 'users.name', 'nombre', 'COLUMN';
EXEC sp_rename 'users.nombre', 'name', 'COLUMN';
```

## Relaciones entre tablas

### Clave primaria y clave foranea

Una clave primaria identifica de forma unica un registro. Una clave foranea apunta a la clave primaria de otra tabla.

Sintaxis general:

```sql
CONSTRAINT nombre_constraint
FOREIGN KEY (columna_local)
REFERENCES tabla_referenciada(columna_referenciada)
```

### Relacion 1:1

Ejemplo: un usuario tiene un DPI y un DPI pertenece a un usuario.

```sql
CREATE TABLE DPI (
    DPI_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    DPI_number INT NOT NULL,
    users_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_DPI_users
        FOREIGN KEY (users_id)
        REFERENCES users(users_id)
);
```

El `UNIQUE` en `users_id` ayuda a garantizar que un usuario no tenga varios DPI registrados en esta tabla.

Insertar datos:

```sql
INSERT INTO DPI (DPI_number, users_id)
VALUES
    (11111, 1),
    (22222, 2),
    (33333, 3);
```

### Relacion 1:N

Ejemplo: una empresa puede tener muchos usuarios, pero cada usuario pertenece a una empresa.

```sql
CREATE TABLE companies (
    company_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    company_name VARCHAR(50) NOT NULL
);

ALTER TABLE users ADD company_id INT NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_companies
    FOREIGN KEY (company_id)
    REFERENCES companies(company_id);
```

Insertar y relacionar datos:

```sql
INSERT INTO companies (company_name)
VALUES ('Empresa A'), ('Empresa B'), ('Empresa C');

UPDATE users SET company_id = 1 WHERE users_id = 1;
UPDATE users SET company_id = 2 WHERE users_id = 2;
UPDATE users SET company_id = 3 WHERE users_id = 3;
```

### Relacion N:N

Ejemplo: un usuario puede conocer muchos lenguajes y un lenguaje puede estar asociado a muchos usuarios.

Para esto se usa una tabla intermedia.

```sql
CREATE TABLE languages (
    languages_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    languages_name VARCHAR(50) NOT NULL
);

CREATE TABLE user_languages (
    user_languages_id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    users_id INT NOT NULL,
    languages_id INT NOT NULL,
    CONSTRAINT fk_user_languages_users
        FOREIGN KEY (users_id)
        REFERENCES users(users_id),
    CONSTRAINT fk_user_languages_languages
        FOREIGN KEY (languages_id)
        REFERENCES languages(languages_id),
    CONSTRAINT uq_user_languages UNIQUE (users_id, languages_id)
);
```

La restriccion `UNIQUE (users_id, languages_id)` evita registrar dos veces que el mismo usuario conoce el mismo lenguaje.

Insertar datos:

```sql
INSERT INTO languages (languages_name)
VALUES ('Swift'), ('Kotlin'), ('Java'), ('Python'), ('C#'), ('Go'), ('JavaScript');

INSERT INTO user_languages (users_id, languages_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 5),
    (2, 7),
    (3, 6),
    (3, 7);
```

## JOIN

Los `JOIN` permiten combinar datos de dos o mas tablas usando columnas relacionadas.

Se usan cuando la informacion esta separada en diferentes tablas, pero necesitas verla junta en una sola consulta.

Por ejemplo:

- Una tabla puede tener los nombres de las personas.
- Otra tabla puede tener las edades.
- Otra tabla puede tener la empresa a la que pertenece cada usuario.
- Otra tabla puede tener los lenguajes que conoce cada usuario.

La idea principal de un `JOIN` es decirle a SQL Server:

> Une estas tablas cuando esta columna de una tabla coincida con esta columna de la otra tabla.

---

### Ejemplo simple con dos tablas: `Nombre` y `Edad`

Supongamos que tienes estas dos tablas.

Tabla `Nombre`:

| PersonaId | Nombre |
| --------- | ------ |
| 1         | Ana    |
| 2         | Luis   |
| 3         | Carlos |
| 4         | Maria  |

Tabla `Edad`:

| PersonaId | Edad |
| --------- | ---- |
| 1         | 25   |
| 2         | 30   |
| 4         | 22   |

Nota que `Carlos` existe en la tabla `Nombre`, pero no tiene edad registrada en la tabla `Edad`.

Crear las tablas:

```sql
CREATE TABLE Nombre (
    PersonaId INT PRIMARY KEY,
    Nombre VARCHAR(50)
);

CREATE TABLE Edad (
    PersonaId INT,
    Edad INT
);
```

Insertar datos:

```sql
INSERT INTO Nombre (PersonaId, Nombre)
VALUES 
    (1, 'Ana'),
    (2, 'Luis'),
    (3, 'Carlos'),
    (4, 'Maria');

INSERT INTO Edad (PersonaId, Edad)
VALUES 
    (1, 25),
    (2, 30),
    (4, 22);
```

---

### Sintaxis general de un JOIN

```sql
SELECT 
    tabla1.columna,
    tabla2.columna
FROM tabla1
INNER JOIN tabla2
    ON tabla1.columna_relacionada = tabla2.columna_relacionada;
```

Lectura de la sintaxis:

- `SELECT`: indica que columnas quieres mostrar.
- `FROM tabla1`: indica la tabla principal desde donde empieza la consulta.
- `INNER JOIN tabla2`: indica la segunda tabla que quieres unir.
- `ON`: indica la condicion que conecta ambas tablas.
- `tabla1.columna_relacionada = tabla2.columna_relacionada`: indica que columnas deben coincidir para unir los registros.

Ejemplo:

```sql
SELECT 
    Nombre.PersonaId,
    Nombre.Nombre,
    Edad.Edad
FROM Nombre
INNER JOIN Edad
    ON Nombre.PersonaId = Edad.PersonaId;
```

Lectura del ejemplo:

- Mostrar el `PersonaId` y `Nombre` de la tabla `Nombre`.
- Mostrar la `Edad` de la tabla `Edad`.
- Unir ambas tablas cuando `Nombre.PersonaId` sea igual a `Edad.PersonaId`.

Resultado:

| PersonaId | Nombre | Edad |
| --------- | ------ | ---- |
| 1         | Ana    | 25   |
| 2         | Luis   | 30   |
| 4         | Maria  | 22   |

`Carlos` no aparece porque no tiene coincidencia en la tabla `Edad`.

---

### Alias en consultas con JOIN

Cuando se escriben consultas con `JOIN`, es comun usar alias para las tablas.

Un alias es un nombre corto temporal que se le asigna a una tabla dentro de una consulta.

Esto ayuda a escribir consultas mas cortas, limpias y faciles de leer.

Ejemplo sin alias:

```sql
SELECT 
    Nombre.PersonaId,
    Nombre.Nombre,
    Edad.Edad
FROM Nombre
INNER JOIN Edad
    ON Nombre.PersonaId = Edad.PersonaId;
```

Ejemplo con alias:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
INNER JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

En este ejemplo:

- `n` es el alias de la tabla `Nombre`.
- `e` es el alias de la tabla `Edad`.
- `n.PersonaId` significa la columna `PersonaId` de la tabla `Nombre`.
- `n.Nombre` significa la columna `Nombre` de la tabla `Nombre`.
- `e.Edad` significa la columna `Edad` de la tabla `Edad`.

La parte:

```sql
FROM Nombre AS n
```

significa:

> A la tabla `Nombre` le llamaremos `n` dentro de esta consulta.

La parte:

```sql
INNER JOIN Edad AS e
```

significa:

> A la tabla `Edad` le llamaremos `e` dentro de esta consulta.

Y la condicion:

```sql
ON n.PersonaId = e.PersonaId
```

significa:

> Une ambas tablas cuando el `PersonaId` de `Nombre` sea igual al `PersonaId` de `Edad`.

Tambien puedes usar alias mas descriptivos:

```sql
SELECT 
    nombre.PersonaId,
    nombre.Nombre,
    edad.Edad
FROM Nombre AS nombre
INNER JOIN Edad AS edad
    ON nombre.PersonaId = edad.PersonaId;
```

Lo importante es que, una vez defines un alias, debes usar ese alias en el resto de la consulta.

Por ejemplo, si escribes:

```sql
FROM Nombre AS n
```

entonces debes usar:

```sql
n.Nombre
```

y no:

```sql
Nombre.Nombre
```

Alias comunes:

```sql
FROM users AS u
FROM companies AS c
FROM languages AS l
FROM user_languages AS ul
```

Tambien es comun ver el alias sin escribir `AS`:

```sql
FROM Nombre n
INNER JOIN Edad e
    ON n.PersonaId = e.PersonaId;
```

Esto funciona igual que:

```sql
FROM Nombre AS n
INNER JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Para aprender, usar `AS` puede ser mas claro.

---

### INNER JOIN

`INNER JOIN` devuelve solamente las filas que tienen coincidencia en ambas tablas.

Es uno de los tipos de `JOIN` mas comunes porque se usa cuando necesitas datos que existen en las dos tablas relacionadas.

Sintaxis general:

```sql
SELECT 
    tabla1.columna,
    tabla2.columna
FROM tabla1 AS alias1
INNER JOIN tabla2 AS alias2
    ON alias1.columna_relacionada = alias2.columna_relacionada;
```

Ejemplo usando `Nombre` y `Edad`:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
INNER JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Resultado:

| PersonaId | Nombre | Edad |
| --------- | ------ | ---- |
| 1         | Ana    | 25   |
| 2         | Luis   | 30   |
| 4         | Maria  | 22   |

`Carlos` no aparece porque no tiene edad registrada.

Lectura del ejemplo:

> Dame las personas que tengan coincidencia en la tabla `Edad`.

En otras palabras:

> Muestra solo las personas que si tienen edad.

---

### LEFT JOIN

`LEFT JOIN` devuelve todas las filas de la tabla izquierda y las coincidencias de la tabla derecha.

Si no hay coincidencia en la tabla derecha, SQL Server muestra `NULL` en las columnas de esa tabla.

La tabla izquierda es la que aparece en el `FROM`.

Sintaxis general:

```sql
SELECT 
    tabla1.columna,
    tabla2.columna
FROM tabla1 AS alias1
LEFT JOIN tabla2 AS alias2
    ON alias1.columna_relacionada = alias2.columna_relacionada;
```

Ejemplo usando `Nombre` y `Edad`:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
LEFT JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Resultado:

| PersonaId | Nombre | Edad |
| --------- | ------ | ---- |
| 1         | Ana    | 25   |
| 2         | Luis   | 30   |
| 3         | Carlos | NULL |
| 4         | Maria  | 22   |

`Carlos` aparece porque esta en la tabla izquierda, que es `Nombre`.

Pero como no tiene coincidencia en la tabla `Edad`, el campo `Edad` aparece como `NULL`.

Lectura del ejemplo:

> Dame todos los nombres, y si tienen edad registrada, muestrala.

Este tipo de `JOIN` es muy util cuando quieres conservar todos los registros principales, aunque falte informacion relacionada.

Ejemplos comunes:

- Mostrar todos los usuarios, aunque no tengan empresa.
- Mostrar todos los productos, aunque no tengan ventas.
- Mostrar todos los clientes, aunque no tengan pedidos.
- Mostrar todos los empleados, aunque no tengan departamento asignado.

---

### RIGHT JOIN

`RIGHT JOIN` devuelve todas las filas de la tabla derecha y las coincidencias de la tabla izquierda.

Si no hay coincidencia en la tabla izquierda, SQL Server muestra `NULL` en las columnas de esa tabla.

La tabla derecha es la que aparece despues del `RIGHT JOIN`.

Sintaxis general:

```sql
SELECT 
    tabla1.columna,
    tabla2.columna
FROM tabla1 AS alias1
RIGHT JOIN tabla2 AS alias2
    ON alias1.columna_relacionada = alias2.columna_relacionada;
```

Ejemplo usando `Nombre` y `Edad`:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
RIGHT JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Con los datos actuales, el resultado seria:

| PersonaId | Nombre | Edad |
| --------- | ------ | ---- |
| 1         | Ana    | 25   |
| 2         | Luis   | 30   |
| 4         | Maria  | 22   |

Ahora agreguemos una edad que no tiene persona relacionada:

```sql
INSERT INTO Edad (PersonaId, Edad)
VALUES (5, 40);
```

Si ejecutamos otra vez:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
RIGHT JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Resultado:

| PersonaId | Nombre | Edad |
| --------- | ------ | ---- |
| 1         | Ana    | 25   |
| 2         | Luis   | 30   |
| 4         | Maria  | 22   |
| NULL      | NULL   | 40   |

Aparece la edad `40`, pero no hay nombre relacionado porque no existe una persona con `PersonaId = 5` en la tabla `Nombre`.

Lectura del ejemplo:

> Dame todas las edades, aunque no tengan una persona relacionada.

En la practica, `RIGHT JOIN` se usa menos que `LEFT JOIN`, porque casi siempre puedes reescribirlo cambiando el orden de las tablas.

Por ejemplo, este `RIGHT JOIN`:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Nombre AS n
RIGHT JOIN Edad AS e
    ON n.PersonaId = e.PersonaId;
```

Se puede escribir como `LEFT JOIN` asi:

```sql
SELECT 
    n.PersonaId,
    n.Nombre,
    e.Edad
FROM Edad AS e
LEFT JOIN Nombre AS n
    ON e.PersonaId = n.PersonaId;
```

Ambas consultas conservan todos los registros de la tabla `Edad`.

---

### Diferencia entre INNER JOIN, LEFT JOIN y RIGHT JOIN

Resumen rapido:

```sql
-- Solo coincidencias entre ambas tablas
INNER JOIN

-- Todo lo de la tabla izquierda + coincidencias de la derecha
LEFT JOIN

-- Todo lo de la tabla derecha + coincidencias de la izquierda
RIGHT JOIN
```

Comparacion usando las tablas `Nombre` y `Edad`:

| Tipo de JOIN | Que devuelve |
| ------------ | ------------ |
| `INNER JOIN` | Solo personas que tienen edad |
| `LEFT JOIN`  | Todas las personas, aunque no tengan edad |
| `RIGHT JOIN` | Todas las edades, aunque no tengan persona relacionada |

En la practica, los mas comunes son:

```sql
INNER JOIN
LEFT JOIN
```

`RIGHT JOIN` existe y es valido, pero se usa menos porque normalmente se prefiere ordenar las tablas y usar `LEFT JOIN`.

---

### Recomendaciones para usar JOIN

- Usa `INNER JOIN` cuando solo quieres registros que tengan coincidencia en ambas tablas.
- Usa `LEFT JOIN` cuando quieres conservar todos los registros de la tabla principal.
- Usa `RIGHT JOIN` solo cuando realmente te convenga conservar todos los registros de la tabla derecha.
- En la practica, muchas veces se prefiere `LEFT JOIN` en lugar de `RIGHT JOIN`, cambiando el orden de las tablas.
- Usa alias para que tus consultas sean mas faciles de leer.
- Elige alias claros: `u` para `users`, `c` para `companies`, `l` para `languages`, `ul` para `user_languages`.
- Verifica siempre que el `ON` una columnas equivalentes.
- Normalmente se une una clave foranea con una clave primaria.
- En relaciones N:N, une siempre pasando por la tabla intermedia.

## Indices

Un indice ayuda a mejorar el rendimiento de consultas, especialmente en columnas usadas frecuentemente en filtros, busquedas o joins.

Crear indice:

```sql
CREATE INDEX idx_users_name ON users(name);
```

Consulta que puede aprovechar el indice:

```sql
SELECT * FROM users WHERE name = 'Usuario 1';
```

Eliminar indice:

```sql
DROP INDEX idx_users_name ON users;
```

Notas:

- Los indices aceleran lecturas, pero pueden hacer mas lentas las escrituras porque tambien deben actualizarse.
- No conviene crear indices sin necesidad real.
- Las claves primarias normalmente crean un indice automaticamente.

## Triggers

Un trigger es codigo que se ejecuta automaticamente cuando ocurre un evento en una tabla, como `INSERT`, `UPDATE` o `DELETE`.

Ejemplo: guardar historial del email anterior cuando se actualiza el email de un usuario.

```sql
CREATE TABLE email_history (
    id_email INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    users_id INT NOT NULL,
    old_email VARCHAR(100) NULL,
    changed_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

Crear trigger:

```sql
CREATE TRIGGER tg_users_email_history
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO email_history (users_id, old_email)
    SELECT deleted.users_id, deleted.email
    FROM deleted
    INNER JOIN inserted ON deleted.users_id = inserted.users_id
    WHERE ISNULL(deleted.email, '') <> ISNULL(inserted.email, '');
END;
```

Probar el trigger:

```sql
UPDATE users
SET email = 'nuevoemail@example.com'
WHERE users_id = 1;

SELECT * FROM email_history;
```

Eliminar trigger:

```sql
DROP TRIGGER tg_users_email_history;
```

Tablas especiales dentro de triggers:

- `inserted`: contiene los valores nuevos.
- `deleted`: contiene los valores anteriores en `UPDATE` y los eliminados en `DELETE`.

## Vistas

Una vista es una consulta guardada que se puede consultar como si fuera una tabla. Sirve para simplificar consultas frecuentes o exponer solo ciertas columnas.

```sql
CREATE VIEW v_adult_users AS
SELECT name, age
FROM users
WHERE age >= 18;
```

Consultar vista:

```sql
SELECT * FROM v_adult_users;
```

Modificar vista:

```sql
ALTER VIEW v_adult_users AS
SELECT users_id, name, age
FROM users
WHERE age >= 18;
```

Eliminar vista:

```sql
DROP VIEW v_adult_users;
```

## Procedimientos almacenados

Un procedimiento almacenado, o `stored procedure`, es un bloque de instrucciones SQL que se guarda dentro de la base de datos y se puede ejecutar cuando sea necesario.

Existe para evitar repetir consultas o procesos completos una y otra vez. En lugar de escribir varias instrucciones cada vez, las guardas con un nombre y luego las ejecutas con `EXEC`.

Usos comunes:

- Reutilizar consultas frecuentes.
- Encapsular reglas de negocio dentro de la base de datos.
- Ejecutar operaciones con parametros.
- Centralizar procesos como crear usuarios, actualizar datos o generar reportes.
- Reducir errores por copiar y pegar consultas manualmente.

### Sintaxis basica

```sql
CREATE PROCEDURE nombre_procedimiento
AS
BEGIN
    -- Instrucciones SQL
END;
```

Ejemplo simple: listar usuarios adultos.

```sql
CREATE PROCEDURE sp_get_adult_users
AS
BEGIN
    SELECT users_id, name, age, email
    FROM users
    WHERE age >= 18;
END;
```

Ejecutar el procedimiento:

```sql
EXEC sp_get_adult_users;
```

Resultado esperado:

| users_id | name      | age | email                |
| -------- | --------- | --- | -------------------- |
| 1        | Usuario 1 | 36  | usuario1@example.com |
| 2        | Usuario 2 | 23  | usuario2@example.com |
| 4        | Usuario 4 | 21  | usuario4@example.com |

### Procedimiento con parametros

Los parametros permiten enviar valores al procedimiento para hacerlo mas flexible.

Sintaxis general:

```sql
CREATE PROCEDURE nombre_procedimiento
    @parametro TIPO_DATO
AS
BEGIN
    -- Instrucciones que usan @parametro
END;
```

Ejemplo: buscar usuarios por pais.

```sql
CREATE PROCEDURE sp_get_users_by_country
    @country VARCHAR(50)
AS
BEGIN
    SELECT users_id, name, age, email, country
    FROM users
    WHERE country = @country;
END;
```

Ejecutar enviando un parametro:

```sql
EXEC sp_get_users_by_country @country = 'Guatemala';
```

Resultado esperado:

| users_id | name      | age  | email                | country   |
| -------- | --------- | ---- | -------------------- | --------- |
| 2        | Usuario 2 | 23   | usuario2@example.com | Guatemala |
| 3        | Usuario 3 | NULL | usuario3@example.com | Guatemala |

### Procedimiento para insertar datos

Tambien se pueden usar procedimientos para insertar datos de forma controlada.

```sql
CREATE PROCEDURE sp_create_user
    @name VARCHAR(50),
    @age INT,
    @email VARCHAR(100),
    @country VARCHAR(50)
AS
BEGIN
    INSERT INTO users (name, age, email, country)
    VALUES (@name, @age, @email, @country);
END;
```

Ejecutar el procedimiento:

```sql
EXEC sp_create_user
    @name = 'Usuario 5',
    @age = 30,
    @email = 'usuario5@example.com',
    @country = 'El Salvador';
```

Esto inserta una nueva fila en `users` usando los valores enviados como parametros.

### Modificar un procedimiento

Para cambiar un procedimiento existente se usa `ALTER PROCEDURE`.

```sql
ALTER PROCEDURE sp_get_adult_users
AS
BEGIN
    SELECT users_id, name, age, email, country
    FROM users
    WHERE age >= 18
    ORDER BY age DESC;
END;
```

### Eliminar un procedimiento

```sql
DROP PROCEDURE sp_get_adult_users;
```

### Notas importantes

- Los parametros en SQL Server empiezan con `@`.
- `EXEC` se usa para ejecutar procedimientos almacenados.
- Los procedimientos pueden contener `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN` y otras instrucciones SQL.
- Conviene que el nombre describa claramente lo que hace, por ejemplo `sp_get_users_by_country`.
- Evita guardar logica innecesariamente compleja en procedimientos si puede mantenerse mejor en la aplicacion.

## Sinonimos

Un sinonimo, o `SYNONYM`, es un nombre alternativo para acceder a un objeto de base de datos, como una tabla, vista o procedimiento almacenado.

Sirve para simplificar consultas cuando el objeto real esta en otra base de datos o tiene un nombre largo. El sinonimo no copia los datos; solo crea una referencia hacia el objeto original.

Ejemplo: tenemos una base de datos llamada `BD_Data` con las tablas `Personas` y `Pais`. Luego creamos otra base de datos llamada `BD_SP`, desde donde queremos consultar esas tablas usando sinonimos.

### Crear base de datos para sinonimos

```sql
-- Crear la base de datos
CREATE DATABASE BD_SP;
GO

-- Usar la base de datos
USE BD_SP;
GO
```

### Crear sinonimos

```sql
CREATE SYNONYM [dbo].[Personas]
FOR [BD_Data].[dbo].[Personas];
GO

CREATE SYNONYM [dbo].[Pais]
FOR [BD_Data].[dbo].[Pais];
GO
```

Lectura del ejemplo:

- `[dbo].[Personas]`: es el nombre del sinonimo creado en la base de datos actual, en este caso `BD_SP`.
- `[BD_Data].[dbo].[Personas]`: es la tabla real que esta en la base de datos `BD_Data`.
- `[dbo].[Pais]`: es otro sinonimo dentro de `BD_SP`.
- `[BD_Data].[dbo].[Pais]`: es la tabla real de paises.

Despues de crear los sinonimos, puedes consultar las tablas como si existieran directamente dentro de `BD_SP`.

```sql
SELECT * FROM [dbo].[Personas];

SELECT * FROM [dbo].[Pais];
```

Aunque parece que estas consultando tablas de `BD_SP`, realmente los datos vienen desde `BD_Data`.

### Procedimiento almacenado usando sinonimo de Personas

Este procedimiento consulta todas las personas usando el sinonimo `[dbo].[Personas]`.

```sql
CREATE PROCEDURE sp_get_personas
AS
BEGIN
    SELECT
        PersonaId,
        Nombre,
        Correo,
        Edad,
        Nacionalidad
    FROM [dbo].[Personas];
END;
GO
```

Ejecutar el procedimiento:

```sql
EXEC sp_get_personas;
```

Resultado esperado:

| PersonaId | Nombre        | Correo                   | Edad | Nacionalidad |
| --------- | ------------- | ------------------------ | ---- | ------------ |
| 1         | Carlos Perez  | carlos.perez@email.com   | 25   | Guatemala    |
| 2         | Ana Lopez     | ana.lopez@email.com      | 30   | Mexico       |
| 3         | Luis Martinez | luis.martinez@email.com  | 22   | Colombia     |
| 4         | Maria Gomez   | maria.gomez@email.com    | 28   | Argentina    |
| 5         | Jose Ramirez  | jose.ramirez@email.com   | 35   | Espana       |

### Procedimiento almacenado usando sinonimo de Pais

Este procedimiento consulta todos los paises usando el sinonimo `[dbo].[Pais]`.

```sql
CREATE PROCEDURE sp_get_paises
AS
BEGIN
    SELECT
        PaisId,
        NombrePais,
        Continente,
        Moneda,
        ComidaMasFamosa
    FROM [dbo].[Pais];
END;
GO
```

Ejecutar el procedimiento:

```sql
EXEC sp_get_paises;
```

Resultado esperado:

| PaisId | NombrePais | Continente | Moneda          | ComidaMasFamosa |
| ------ | ---------- | ---------- | --------------- | ---------------- |
| 1      | Guatemala  | America    | Quetzal         | Pepian           |
| 2      | Mexico     | America    | Peso mexicano   | Tacos            |
| 3      | Colombia   | America    | Peso colombiano | Bandeja paisa    |
| 4      | Argentina  | America    | Peso argentino  | Asado            |
| 5      | Espana     | Europa     | Euro            | Paella           |

### Procedimiento almacenado con JOIN usando sinonimos

Tambien puedes usar sinonimos dentro de un `JOIN`.

En este ejemplo se unen las personas con su pais usando la columna `Nacionalidad` de `Personas` y la columna `NombrePais` de `Pais`.

```sql
CREATE PROCEDURE sp_get_personas_con_pais
AS
BEGIN
    SELECT
        p.PersonaId,
        p.Nombre,
        p.Correo,
        p.Edad,
        p.Nacionalidad,
        pa.Continente,
        pa.Moneda,
        pa.ComidaMasFamosa
    FROM [dbo].[Personas] AS p
    INNER JOIN [dbo].[Pais] AS pa
        ON p.Nacionalidad = pa.NombrePais;
END;
GO
```

Ejecutar el procedimiento:

```sql
EXEC sp_get_personas_con_pais;
```

Resultado esperado:

| PersonaId | Nombre        | Edad | Nacionalidad | Continente | Moneda          | ComidaMasFamosa |
| --------- | ------------- | ---- | ------------ | ---------- | --------------- | ---------------- |
| 1         | Carlos Perez  | 25   | Guatemala    | America    | Quetzal         | Pepian           |
| 2         | Ana Lopez     | 30   | Mexico       | America    | Peso mexicano   | Tacos            |
| 3         | Luis Martinez | 22   | Colombia     | America    | Peso colombiano | Bandeja paisa    |
| 4         | Maria Gomez   | 28   | Argentina    | America    | Peso argentino  | Asado            |
| 5         | Jose Ramirez  | 35   | Espana       | Europa     | Euro            | Paella           |

### Procedimiento almacenado con parametro usando sinonimos

Este procedimiento recibe una nacionalidad y devuelve solo las personas que pertenecen a ese pais.

```sql
CREATE PROCEDURE sp_get_personas_by_nacionalidad
    @Nacionalidad NVARCHAR(100)
AS
BEGIN
    SELECT
        PersonaId,
        Nombre,
        Correo,
        Edad,
        Nacionalidad
    FROM [dbo].[Personas]
    WHERE Nacionalidad = @Nacionalidad;
END;
GO
```

Ejecutar enviando un parametro:

```sql
EXEC sp_get_personas_by_nacionalidad
    @Nacionalidad = 'Guatemala';
```

Resultado esperado:

| PersonaId | Nombre       | Correo                 | Edad | Nacionalidad |
| --------- | ------------ | ---------------------- | ---- | ------------ |
| 1         | Carlos Perez | carlos.perez@email.com | 25   | Guatemala    |

### Eliminar sinonimos

Para eliminar un sinonimo se usa `DROP SYNONYM`.

```sql
DROP SYNONYM [dbo].[Personas];
GO

DROP SYNONYM [dbo].[Pais];
GO
```

> `DROP SYNONYM` solo elimina el nombre alternativo. No elimina la tabla original ni sus datos en `BD_Data`.

### Notas importantes

- Un sinonimo no guarda datos; solo apunta a otro objeto.
- Si la tabla original cambia de nombre o se elimina, el sinonimo dejara de funcionar.
- Si la tabla original cambia su estructura, no es necesario volver a crear el sinonimo, ya que funciona como referencia unicamente.
- Los sinonimos ayudan a escribir consultas mas cortas cuando trabajas con objetos de otra base de datos.
- Puedes usar sinonimos dentro de `SELECT`, `JOIN`, vistas y procedimientos almacenados.
- Antes de crear el sinonimo, la base de datos y el objeto real deben existir.
- `CREATE PROCEDURE` debe ejecutarse en un lote separado, por eso se usa `GO` antes o despues de crear cada procedimiento.

## Transacciones

Una transaccion permite agrupar varias operaciones SQL para que se ejecuten como una sola unidad de trabajo.

Existe para proteger la consistencia de los datos. Si todas las operaciones salen bien, confirmas los cambios con `COMMIT`. Si algo falla, puedes deshacer todo con `ROLLBACK`.

Usos comunes:

- Evitar cambios incompletos cuando una operacion tiene varios pasos.
- Proteger operaciones importantes como pagos, inventario o transferencias.
- Asegurar que varias tablas relacionadas se actualicen juntas.
- Probar cambios manuales y revertirlos si el resultado no es correcto.

### Sintaxis basica

```sql
BEGIN TRANSACTION;

-- Instrucciones SQL

COMMIT;
```

Ejemplo: actualizar el pais de un usuario y confirmar el cambio.

```sql
BEGIN TRANSACTION;

UPDATE users
SET country = 'Guatemala'
WHERE users_id = 1;

COMMIT;
```

Si ejecutas `COMMIT`, el cambio queda guardado.

### Deshacer una transaccion

`ROLLBACK` revierte los cambios hechos dentro de la transaccion.

```sql
BEGIN TRANSACTION;

UPDATE users
SET country = 'Pendiente'
WHERE users_id = 1;

ROLLBACK;
```

En este caso, el `UPDATE` no queda guardado porque la transaccion se revierte.

### Ejemplo con varias operaciones

Supongamos que quieres crear un usuario y asignarle un lenguaje. Ambas operaciones deberian funcionar juntas.

```sql
BEGIN TRANSACTION;

INSERT INTO users (name, age, email, country)
VALUES ('Usuario 6', 28, 'usuario6@example.com', 'Guatemala');

DECLARE @new_user_id INT = SCOPE_IDENTITY();

INSERT INTO user_languages (users_id, languages_id)
VALUES (@new_user_id, 7);

COMMIT;
```

Si el usuario se inserta, pero falla la relacion con `user_languages`, no conviene dejar el usuario creado a medias. Para eso se usa el patron con `TRY/CATCH`.

### Transaccion con TRY/CATCH

Este patron permite confirmar si todo sale bien o revertir si ocurre un error.

```sql
BEGIN TRY
    BEGIN TRANSACTION;

    INSERT INTO users (name, age, email, country)
    VALUES ('Usuario 7', 32, 'usuario7@example.com', 'Guatemala');

    DECLARE @new_user_id INT = SCOPE_IDENTITY();

    INSERT INTO user_languages (users_id, languages_id)
    VALUES (@new_user_id, 7);

    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;

    SELECT ERROR_MESSAGE() AS error_message;
END CATCH;
```

Que hace este ejemplo:

- `BEGIN TRY`: intenta ejecutar las instrucciones.
- `BEGIN TRANSACTION`: inicia la transaccion.
- `COMMIT`: confirma los cambios si no hubo errores.
- `BEGIN CATCH`: captura el error si algo falla.
- `ROLLBACK`: revierte todos los cambios de la transaccion.
- `ERROR_MESSAGE()`: muestra el mensaje del error.

### Transacciones dentro de procedimientos almacenados

Las transacciones suelen combinarse con procedimientos almacenados cuando quieres guardar una operacion completa y segura.

```sql
CREATE PROCEDURE sp_create_user_with_language
    @name VARCHAR(50),
    @age INT,
    @email VARCHAR(100),
    @country VARCHAR(50),
    @languages_id INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO users (name, age, email, country)
        VALUES (@name, @age, @email, @country);

        DECLARE @new_user_id INT = SCOPE_IDENTITY();

        INSERT INTO user_languages (users_id, languages_id)
        VALUES (@new_user_id, @languages_id);

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        SELECT ERROR_MESSAGE() AS error_message;
    END CATCH;
END;
```

Ejecutar el procedimiento:

```sql
EXEC sp_create_user_with_language
    @name = 'Usuario 8',
    @age = 26,
    @email = 'usuario8@example.com',
    @country = 'Guatemala',
    @languages_id = 7;
```

### Notas importantes

- Una transaccion abierta bloquea recursos hasta que se hace `COMMIT` o `ROLLBACK`.
- No dejes transacciones abiertas por mucho tiempo.
- Usa `TRY/CATCH` cuando una transaccion tenga varias operaciones importantes.
- Si haces pruebas manuales, puedes usar `BEGIN TRANSACTION`, revisar con `SELECT` y luego decidir entre `COMMIT` o `ROLLBACK`.
- `ROLLBACK` solo revierte cambios dentro de la transaccion actual.

## Buenas practicas

- Usa nombres consistentes para tablas, columnas y constraints.
- Evita reejecutar scripts completos con `INSERT` si ya hay datos cargados.
- Usa `WHERE` en `UPDATE` y `DELETE` para evitar cambios masivos accidentales.
- Usa `NULL` solo cuando el dato realmente pueda faltar.
- Define claves primarias en todas las tablas.
- Define claves foraneas para proteger la integridad de las relaciones.
- Usa `UNIQUE` cuando no deben existir duplicados.
- Crea indices solo cuando ayuden a consultas reales.
- En relaciones N:N, usa siempre una tabla intermedia.
- Al escribir `JOIN`, verifica que estes uniendo columnas equivalentes: clave foranea contra clave primaria.
