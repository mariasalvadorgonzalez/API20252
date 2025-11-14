import express from "express";
import { crearCategoria, listarCategorias } from "../controladores/categoriasCtrl.js";

const router = express.Router();

// Registrar categoría
router.post("/categorias", crearCategoria);

// Listar categorías
router.get("/categorias", listarCategorias);

export default router;
