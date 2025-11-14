import { conmysql } from "../db.js";

// Registrar categoría
export const crearCategoria = async (req, res) => {
  try {
    const { cat_nombre, cat_descripcion } = req.body;

    if (!cat_nombre) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    const [result] = await conmysql.query(
      "INSERT INTO categorias (cat_nombre, cat_descripcion) VALUES (?, ?)",
      [cat_nombre, cat_descripcion]
    );

    res.json({
      message: "Categoría registrada correctamente",
      cat_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar categorías
export const listarCategorias = async (req, res) => {
  try {
    const [rows] = await conmysql.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
