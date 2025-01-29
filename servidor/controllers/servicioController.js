const { servicios } = require("../models/servicioModel");
const { v4: uuidv4 } = require("uuid");

// Obtener todos los servicios
const getAllServicios = (req, res) => {
  res.json(servicios);
};

// Obtener un servicio por ID
const getServicioById = (req, res) => {
  const { id } = req.params;
  const servicio = servicios.find((s) => s.ID === parseInt(id));
  if (!servicio) {
    return res.status(404).json({ error: "Servicio no encontrado." });
  }
  res.json(servicio);
};

// Crear un nuevo servicio
const createServicio = (req, res) => {
  const { nombre, costo } = req.body;

  if (!nombre || costo === undefined) {
    return res.status(400).json({ error: "Nombre y costo son requeridos." });
  }

  const nuevoServicio = {
    ID: servicios.length ? Math.max(...servicios.map((s) => s.ID)) + 1 : 1, // ID secuencial
    nombre,
    costo: parseFloat(costo),
  };

  servicios.push(nuevoServicio);
  res.status(201).json(nuevoServicio);
};

// Actualizar un servicio por ID
const updateServicio = (req, res) => {
  const { id } = req.params;
  const { nombre, costo } = req.body;

  const servicio = servicios.find((s) => s.ID === parseInt(id)); // Buscar por ID numérico
  if (!servicio) {
    return res.status(404).json({ error: "Servicio no encontrado." });
  }

  if (nombre) servicio.nombre = nombre;
  if (costo !== undefined) servicio.costo = parseFloat(costo);

  res.json(servicio);
};

// Eliminar un servicio por ID
const deleteServicio = (req, res) => {
  const { id } = req.params;
  const index = servicios.findIndex((s) => s.ID === parseInt(id)); // Buscar por ID numérico
  if (index === -1) {
    return res.status(404).json({ error: "Servicio no encontrado." });
  }

  const [deletedServicio] = servicios.splice(index, 1);
  res.json(deletedServicio);
};

module.exports = {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
};
