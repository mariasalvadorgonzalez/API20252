import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

// Importar el nombre correcto
import {
    getPedidos,
    getPedidoxId,
    postPedido,
    putPedido,
    deletePedido,
    getPedidosPorFechas   // ✅ este es el correcto
} from "../controladores/pedidosCtrl.js";

const router = Router();

// === RUTAS ===
router.get("/pedidos", verifyToken, getPedidos);
router.get("/pedidos/:id", verifyToken, getPedidoxId);
router.post("/pedidos", verifyToken, postPedido);
router.put("/pedidos/:id", verifyToken, putPedido);
router.delete("/pedidos/:id", verifyToken, deletePedido);

// CAMBIA ESTA RUTA:
router.post("/pedidos/fechas", verifyToken, getPedidosPorFechas); 
//                   ⬆⬆⬆ nombre correcto

export default router;
