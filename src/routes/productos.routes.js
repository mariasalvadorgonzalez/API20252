import { Router } from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from '../middlewares/upload.js';

// Controladores
import { 
  getProductos,
  getProductosxId,
  postProducto,
  putProducto,
  deleteProducto
} from "../controladores/productosCtrl.js";

const router = Router();

router.get("/productos", verifyToken, getProductos);
router.get("/productos/:id", verifyToken, getProductosxId);

// Registrar producto con imagen + cat_id
router.post("/productos", verifyToken, upload.single("imagen"), postProducto);

// Actualizar producto
router.put("/productos/:id", verifyToken, upload.single("imagen"), putProducto);

// Eliminar producto
router.delete("/productos/:id", verifyToken, deleteProducto);

export default router;
