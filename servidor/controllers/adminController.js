const { findAdmin } = require("../models/adminModel");

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  const admin = findAdmin(username, password);

  if (!admin) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  // Respuesta para un inicio de sesión exitoso
  return res.status(200).json({
    message: "Inicio de sesión exitoso",
    role: admin.role,
    username: admin.nombreUsuario,
    usuario: {
      ID: admin.ID,
      nombre: admin.nombre,
      apellido: admin.apellido,
      email: admin.email,
      teléfono: admin.teléfono,
    },
  });
};

module.exports = { loginAdmin };
