import { conmysql } from "../db.js"; // Conexión a la base de datos
import bcrypt from "bcryptjs";

// === PRUEBA DE CONEXIÓN ===
export const prueba = (req, res) => {
  res.send("prueba con éxito - usuarios");
};

// === OBTENER TODOS LOS USUARIOS ===
export const getUsuarios = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM usuarios");
    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === BUSCAR USUARIO POR ID ===
export const getUsuarioxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_id = ?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({
        cant: 0,
        message: "Usuario no encontrado",
      });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getUsuarioxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === INSERTAR UN NUEVO USUARIO ===
export const postUsuario = async (req, res) => {
  try {
    const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

    if (!usr_usuario || !usr_clave) {
      return res.status(400).json({ message: "Usuario o clave faltante" });
    }

    // 🔹 Hashear automáticamente la contraseña
    const hashPassword = await bcrypt.hash(usr_clave, 10);

    // Insertar en la tabla usuarios (para la app)
    const [resultUsuarios] = await conmysql.query(
      "INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?,?,?,?,?,?)",
      [usr_usuario, hashPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
    );

    // Insertar en la tabla users (registro extra)
    const [resultUsers] = await conmysql.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [usr_usuario, hashPassword]
    );

    res.json({ 
      usr_id: resultUsuarios.insertId,
      message: "Usuario creado en usuarios y users automáticamente"
    });

  } catch (error) {
    console.error("Error en postUsuario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === MODIFICAR UN USUARIO EXISTENTE ===
export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

    // Hashear la nueva contraseña si viene
    const hashPassword = usr_clave ? await bcrypt.hash(usr_clave, 10) : undefined;

    const [result] = await conmysql.query(
      `UPDATE usuarios SET 
        usr_usuario=?,
        ${hashPassword ? "usr_clave=?," : ""}
        usr_nombre=?,
        usr_telefono=?,
        usr_correo=?,
        usr_activo=?
      WHERE usr_id=?`,
      hashPassword
        ? [usr_usuario, hashPassword, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        : [usr_usuario, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const [fila] = await conmysql.query("SELECT * FROM usuarios WHERE usr_id=?", [id]);
    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putUsuario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR USUARIO ===
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query("DELETE FROM usuarios WHERE usr_id = ?", [id]);

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

