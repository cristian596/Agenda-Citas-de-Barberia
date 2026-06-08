const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importamos PostgreSQL

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la Base de Datos
// Docker inyectará la variable 'DATABASE_URL' automáticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin_citas:password_secreto_123@localhost:5432/bd_sistema_citas'
});

// --- FUNCIÓN DE CONEXIÓN INTELIGENTE CON REINTENTOS ---
const conectarConReintentos = async (intentosRestantes = 5) => {
  if (intentosRestantes === 0) {
    console.error("❌ No se pudo conectar a PostgreSQL después de varios intentos. Servidor inestable.");
    return;
  }

  try {
    // Intentamos ejecutar la creación de la tabla
    await pool.query(`
      CREATE TABLE IF NOT EXISTS citas (
        id SERIAL PRIMARY KEY,
        cliente VARCHAR(100) NOT NULL,
        servicio VARCHAR(100) NOT NULL,
        hora VARCHAR(50) NOT NULL
      );
    `);
    console.log("=========================================");
    console.log("🚀 ¡Tabla 'citas' verificada/creada con éxito en PostgreSQL!");
    console.log("=========================================");
  } catch (error) {
    console.log(`⚠️ La base de datos está despertando. Reintentando en 3 segundos... (Intentos restantes: ${intentosRestantes - 1})`);
    // Esperamos 3 segundos antes de volver a intentar
    await new Promise(resolve => setTimeout(resolve, 3000));
    return conectarConReintentos(intentosRestantes - 1);
  }
};

// Llamamos a la función para que gestione la creación al arrancar
conectarConReintentos();

// --- RUTAS CON BASE DE DATOS REAL ---

// Ruta GET: Trae las citas desde PostgreSQL
app.get('/api/citas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM citas ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las citas de la BD" });
  }
});

// Ruta POST: Inserta una nueva cita en PostgreSQL
app.post('/api/citas', async (req, res) => {
  const { cliente, servicio, hora } = req.body;

  if (!cliente || !servicio || !hora) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const nuevoRegistro = await pool.query(
      'INSERT INTO citas (cliente, servicio, hora) VALUES ($1, $2, $3) RETURNING *',
      [cliente, servicio, hora]
    );
    console.log("Cita guardada en BD:", nuevoRegistro.rows[0]);
    res.status(201).json(nuevoRegistro.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la cita en la BD" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});