// app.js
import express from 'express';
import cors from 'cors';
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

// === CORS ===
const allowedOrigins = [
  'http://localhost:8100',              // Ionic dev server
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
  'ionic://localhost',
  'https://api2025-2-spae.onrender.com' // tu frontend en producción
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // permitir requests desde Postman, curl, etc.
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS no permitido para este origen';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
