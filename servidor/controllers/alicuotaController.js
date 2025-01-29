const { alicuotas } = require("../models/alicuotaModel");
const { Servicio } = require("../models/servicioModel");
const { v4: uuidv4 } = require("uuid");

// Obtener todas las alícuotas
const getAllAlicuotas = (req, res) => {
  res.json(alicuotas);
};

// Obtener una alícuota por ID
const getAlicuotaById = (req, res) => {
  const { id } = req.params;
  const alicuota = alicuotas.find((a) => a.ID === id);
  if (!alicuota) {
    return res.status(404).json({ error: "Alicuota no encontrada." });
  }
  res.json(alicuota);
};

// Crear una nueva alícuota
const createAlicuota = (req, res) => {
  const { serviciosIds, mes, anio, fechaLimitePago } = req.body;

  if (!mes || !anio || !fechaLimitePago) {
    return res.status(400).json({ error: "Mes, año y fecha límite de pago son requeridos." });
  }

  const servicios = serviciosIds.map((id) => {
    const servicio = servicios.find((s) => s.ID === id);
    if (!servicio) {
      throw new Error(`Servicio con ID ${id} no encontrado.`);
    }
    return servicio;
  });

  const nuevaAlicuota = {
    ID: uuidv4(),
    servicios,
    monto: servicios.reduce((total, s) => total + s.costo, 0),
    mes,
    anio,
    fechaLimitePago,
  };

  alicuotas.push(nuevaAlicuota);
  res.status(201).json(nuevaAlicuota);
};

// Actualizar una alícuota por ID
const updateAlicuota = (req, res) => {
  const { id } = req.params;
  const { serviciosIds, mes, anio, fechaLimitePago } = req.body;

  const alicuota = alicuotas.find((a) => a.ID === id);
  if (!alicuota) {
    return res.status(404).json({ error: "Alicuota no encontrada." });
  }

  if (serviciosIds) {
    const servicios = serviciosIds.map((id) => {
      const servicio = servicios.find((s) => s.ID === id);
      if (!servicio) {
        throw new Error(`Servicio con ID ${id} no encontrado.`);
      }
      return servicio;
    });
    alicuota.servicios = servicios;
    alicuota.monto = servicios.reduce((total, s) => total + s.costo, 0);
  }

  if (mes) alicuota.mes = mes;
  if (anio) alicuota.anio = anio;
  if (fechaLimitePago) alicuota.fechaLimitePago = fechaLimitePago;

  res.json(alicuota);
};

// Eliminar una alícuota por ID
const deleteAlicuota = (req, res) => {
  const { id } = req.params;
  const index = alicuotas.findIndex((a) => a.ID === id);
  if (index === -1) {
    return res.status(404).json({ error: "Alicuota no encontrada." });
  }

  const [eliminada] = alicuotas.splice(index, 1);
  res.json(eliminada);
};

module.exports = {
  getAllAlicuotas,
  getAlicuotaById,
  createAlicuota,
  updateAlicuota,
  deleteAlicuota,
};
