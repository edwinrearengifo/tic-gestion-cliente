const express = require("express");
const {
  getResidentes,
  createResidente,
  updateResidenteById,
  deleteResidenteById,
  loginResidente,
  registrarPagoResidente, // Importar la función para registrar pagos
  getPagosResidente, // Importar la función para obtener los pagos
} = require("../controllers/residenteController");

const router = express.Router();

// Ruta para login de residentes
router.post("/login/residente", loginResidente);

// Rutas CRUD para Residente
router.get("/", getResidentes);
router.post("/", createResidente);
router.put("/:ID", updateResidenteById);
router.delete("/:ID", deleteResidenteById);

// Nuevas rutas para la gestión de pagos
router.post("/:ID/pagos", registrarPagoResidente); // Registrar un pago para un residente
router.get("/:ID/pagos", getPagosResidente); // Obtener la lista de pagos de un residente

module.exports = router;
