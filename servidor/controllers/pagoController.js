const { pagos } = require("../models/pagoModel");
const { residentes } = require("../models/residenteModel");
const { alicuotas } = require("../models/alicuotaModel");
const { v4: uuidv4 } = require("uuid");

// Obtener todos los pagos
const getAllPagos = (req, res) => {
  res.json(pagos);
};

// Obtener un pago por ID
const getPagoById = (req, res) => {
  const { id } = req.params;
  const pago = pagos.find((p) => p.ID === id);
  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado." });
  }

  const residente = residentes.find((r) => r.ID === pago.residenteID);
  if (!residente) {
    return res.status(400).json({ error: "Residente no encontrado." });
  }

  res.json({
    ...pago,
    abonosAcumulados: residente.abonosAcumulados,
    deudasAcumuladas: residente.deudasAcumuladas,
  });
};


// Crear un nuevo pago
const createPago = (req, res) => {
  const { residenteID, alicuotaID, mes, anio, metodoPago, monto, multa = {}, deuda = 0, abono = 0 } = req.body;

  // Validar residente y alícuota
  const residente = residentes.find((r) => r.ID === residenteID);
  const alicuota = alicuotas.find((a) => a.ID === alicuotaID);

  if (!residente || !alicuota) {
    return res.status(400).json({ error: "Residente o Alícuota no encontrado." });
  }

  // Calcular valores acumulados de deuda y abono
  const deudaAcumulada = residente.deudasAcumuladas.reduce((acc, val) => acc + val, 0);
  const abonoAcumulado = residente.abonosAcumulados.reduce((acc, val) => acc + val, 0);
  const montoPagadoConAbono = monto + abonoAcumulado;

  // Calcular nueva deuda y abono
  const nuevaDeuda = Math.max(alicuota.monto + deudaAcumulada - montoPagadoConAbono, 0);
  const nuevoAbono = Math.max(montoPagadoConAbono - (alicuota.monto + deudaAcumulada), 0);


  // Crear el nuevo pago
  const nuevoPago = {
    ID: uuidv4(),
    residenteID,
    alicuotaID,
    mes,
    anio,
    metodoPago,
    monto,
    multa: {
      aplica: multa.aplica || false,
      valor: multa.valor || 0,
      descripcion: multa.descripcion || "N/A",
    },
    deuda: nuevaDeuda,
    abono: nuevoAbono,
    estado:
      nuevoAbono > 0
        ? "Pagado + Abono"
        : nuevaDeuda > 0
        ? "Pagado Parcial"
        : "Pagado Completo",
        valorAlicuota: alicuota.monto,
  };

  try {
    // Registrar el pago en el residente y actualizar su estado
    residente.registrarPago(nuevoPago, alicuota);
    // Actualizar las listas acumulativas
    if (nuevoAbono > 0) residente.abonosAcumulados.push(nuevoAbono);
    if (nuevaDeuda > 0) residente.deudasAcumuladas.push(nuevaDeuda);

    pagos.push(nuevoPago);
    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un pago por ID
const updatePago = (req, res) => {
  const { id } = req.params;
  const { metodoPago, monto, multa, deuda, abono } = req.body;

  const pago = pagos.find((p) => p.ID === id);
  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado." });
  }

  // Obtener el residente asociado al pago
  const residente = residentes.find((r) => r.ID === pago.residenteID);
  if (!residente) {
    return res.status(400).json({ error: "Residente no encontrado." });
  }

  // Actualizar listas acumulativas si deuda o abono cambian
  if (deuda !== undefined && deuda !== pago.deuda) {
    const indexDeuda = residente.deudasAcumuladas.indexOf(pago.deuda);
    if (indexDeuda !== -1) residente.deudasAcumuladas[indexDeuda] = deuda;
  }
  if (abono !== undefined && abono !== pago.abono) {
    const indexAbono = residente.abonosAcumulados.indexOf(pago.abono);
    if (indexAbono !== -1) residente.abonosAcumulados[indexAbono] = abono;
  }

  // Actualizar campos
  if (metodoPago) pago.metodoPago = metodoPago;
  if (monto) pago.monto = monto;
  if (multa) {
    pago.multa = {
      aplica: multa.aplica || pago.multa.aplica,
      valor: multa.valor || pago.multa.valor,
      descripcion: multa.descripcion || pago.multa.descripcion,
    };
  }
  if (deuda !== undefined) pago.deuda = deuda;
  if (abono !== undefined) pago.abono = abono;

  res.json(pago);
};

// Eliminar un pago por ID
const deletePago = (req, res) => {
  const { id } = req.params;
  const index = pagos.findIndex((p) => p.ID === id);
  if (index === -1) {
    return res.status(404).json({ error: "Pago no encontrado." });
  }

  const [eliminado] = pagos.splice(index, 1);
  res.json(eliminado);
};

module.exports = {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
};
