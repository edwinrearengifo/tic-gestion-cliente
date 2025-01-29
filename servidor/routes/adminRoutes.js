const express = require("express");
const { 
  loginAdmin
} = require("../controllers/adminController");

const { 
  loginResidente
} = require("../controllers/residenteController");

const {
  getAllAlicuotas,
  getAlicuotaById,
  createAlicuota,
  updateAlicuota,
  deleteAlicuota,
} = require("../controllers/alicuotaController");

const {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} = require("../controllers/pagoController");

const {
  getAllResidentes,
  getResidenteById,
  createResidente,
  updateResidente,
  deleteResidente,
  associateAlicuotaToResidente,
  getPagosByResidente,
  registrarPago,
  updatePagoByResidente,
  getPagoByMesYAnio,
  getPagoParaModificar,
} = require("../controllers/residenteController");

const {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
} = require("../controllers/servicioController");

const {
  getAllViviendas,
  createVivienda,
  updateVivienda,
  deleteVivienda,
} = require("../controllers/viviendaController");

const router = express.Router();

// Login para Administrador y Residente
router.post("/api/admins/login", loginAdmin);
router.post("/api/residentes/login", loginResidente);

// Alicuota Routes
router.get("/api/alicuotas", getAllAlicuotas);
router.get("/api/alicuotas/:id", getAlicuotaById);
router.post("/api/alicuotas", createAlicuota);
router.put("/api/alicuotas/:id", updateAlicuota);
router.delete("/api/alicuotas/:id", deleteAlicuota);

// Pago Routes
router.get("/api/pagos", getAllPagos);
router.get("/api/pagos/:id", getPagoById);
router.post("/api/pagos", createPago);
router.put("/api/pagos/:id", updatePago);
router.delete("/api/pagos/:id", deletePago);

// Residente Routes
router.get("/api/residentes", getAllResidentes);
router.get("/api/residentes/:id", getResidenteById);
router.post("/api/residentes", createResidente);
router.put("/api/residentes/:id", updateResidente);
router.delete("/api/residentes/:id", deleteResidente);
router.post("/api/residentes/alicuotas", associateAlicuotaToResidente);
router.get("/api/residentes/:id/pagos", getPagosByResidente);
router.post("/api/residentes/:id/pagos", registrarPago);
router.put("/api/residentes/:id/pagos", updatePagoByResidente);
router.get("/api/residentes/:id/pago", getPagoByMesYAnio);
router.get("/api/residentes/:id/pago-para-modificar", getPagoParaModificar);


// Servicio Routes
router.get("/api/servicios", getAllServicios);
router.get("/api/servicios/:id", getServicioById);
router.post("/api/servicios", createServicio);
router.put("/api/servicios/:id", updateServicio);
router.delete("/api/servicios/:id", deleteServicio);

// Vivienda Routes
router.get("/api/viviendas", getAllViviendas);
router.post("/api/viviendas", createVivienda);
router.put("/api/viviendas/:id", updateVivienda);
router.delete("/api/viviendas/:id", deleteVivienda);

module.exports = router;
