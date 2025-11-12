// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Configuración de __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === CORS seguro con preflight ===
const allowedOrigins = [
  'http://localhost:8100',              // Ionic dev server
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
  'ionic://localhost',
  'https://api2025-2-spae.onrender.com' // tu frontend en producción
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  // Responder OPTIONS rápido
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Carpeta de uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// === RUTAS ===
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', pedidosRoutes);

// Manejo de endpoints no encontrados
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default app;
