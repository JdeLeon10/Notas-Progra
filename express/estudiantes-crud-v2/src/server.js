import 'dotenv/config';
import { app } from './app.js';
import { checkConnection } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await checkConnection();
    console.log('Conexión a MySQL exitosa');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

main();
