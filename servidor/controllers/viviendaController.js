// Controlador Vivienda actualizado
const { Vivienda, viviendas } = require("../models/viviendaModel");

// Obtener todas las viviendas
const getAllViviendas = (req, res) => {
  try {
    res.status(200).json(viviendas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las viviendas." });
  }
};

// Crear una nueva vivienda
const createVivienda = (req, res) => {
  try {
    const { numeracion, ocupanteID } = req.body;

    if (!numeracion) {
      return res.status(400).json({ error: "El número de casa es obligatorio." });
    }

    // Validar que no se repita la numeración
    if (viviendas.some((v) => v.numeracion === numeracion)) {
      return res.status(400).json({ error: "El número de casa ya está registrado." });
    }

    // Validar que el ocupante no esté registrado en otra vivienda
    if (ocupanteID && viviendas.some((v) => v.ocupanteID === ocupanteID)) {
      return res.status(400).json({ error: "El residente ya está asignado a otra vivienda." });
    }

    const nuevaVivienda = new Vivienda(
      viviendas.length ? Math.max(...viviendas.map((v) => v.ID)) + 1 : 1,
      numeracion,
      ocupanteID || null
    );

    viviendas.push(nuevaVivienda);
    res.status(201).json({ message: "Vivienda creada exitosamente.", vivienda: nuevaVivienda });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la vivienda." });
  }
};

// Actualizar una vivienda existente
const updateVivienda = (req, res) => {
  try {
    const { id } = req.params;
    const { numeracion, ocupanteID } = req.body;

    const vivienda = viviendas.find((v) => v.ID === parseInt(id));

    if (!vivienda) {
      return res.status(404).json({ error: "Vivienda no encontrada." });
    }

    // Validar que no se repita la numeración (excepto la vivienda actual)
    if (numeracion && viviendas.some((v) => v.numeracion === numeracion && v.ID !== vivienda.ID)) {
      return res.status(400).json({ error: "El número de casa ya está registrado." });
    }

    // Validar que el ocupante no esté registrado en otra vivienda
    if (ocupanteID && viviendas.some((v) => v.ocupanteID === ocupanteID && v.ID !== vivienda.ID)) {
      return res.status(400).json({ error: "El residente ya está asignado a otra vivienda." });
    }

    if (numeracion) vivienda.numeracion = numeracion;

    // Cambiar ocupante y actualizar historial
    if (ocupanteID && ocupanteID !== vivienda.ocupanteID) {
      vivienda.cambiarOcupante(ocupanteID);
    }

    res.status(200).json({ message: "Vivienda actualizada exitosamente.", vivienda });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la vivienda." });
  }
};

// Eliminar una vivienda
const deleteVivienda = (req, res) => {
  try {
    const { id } = req.params;

    const index = viviendas.findIndex((v) => v.ID === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: "Vivienda no encontrada." });
    }

    const [eliminada] = viviendas.splice(index, 1);
    res.status(200).json({ message: "Vivienda eliminada exitosamente.", vivienda: eliminada });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la vivienda." });
  }
};

module.exports = {
  getAllViviendas,
  createVivienda,
  updateVivienda,
  deleteVivienda,
};