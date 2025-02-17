const { residentes } = require("../models/residenteModel");
const { alicuotas } = require("../models/alicuotaModel");
const { pagos } = require("../models/pagoModel");
const { findResidente } = require("../models/residenteModel");

let currentID = residentes.length > 0 ? Math.max(...residentes.map((r) => r.ID)) + 1 : 1; // Calcula el siguiente ID disponible

// Obtener todos los residentes
const getAllResidentes = (req, res) => {
  res.json(residentes);
};

// Obtener un residente por ID
const getResidenteById = (req, res) => {
  const { id } = req.params;
  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }
  res.json(residente);
};

// Login para un residente
const loginResidente = (req, res) => {
  const { username, password } = req.body;

  const residente = findResidente(username, password);

  if (!residente) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  // Respuesta para un inicio de sesión exitoso
  return res.status(200).json({
    message: "Inicio de sesión exitoso",
    role: "Residente",
    username: residente.nombreUsuario,
    usuario: {
      ID: residente.ID,
      nombre: residente.nombre,
      apellido: residente.apellido,
      nombreUsuario: residente.nombreUsuario,
      email: residente.email,
      teléfono: residente.teléfono,
      tipo: residente.tipo,
    },
  });
};

// Crear un nuevo residente
const createResidente = (req, res) => {
  const { nombre, apellido, nombreUsuario, email, contraseña, teléfono, tipo } = req.body;

  if (!nombre || !apellido || !nombreUsuario || !email || !contraseña || !teléfono) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  const nuevoResidente = {
    ID: currentID++, // Asigna el siguiente ID secuencial
    nombre,
    apellido,
    nombreUsuario,
    email,
    contraseña,
    teléfono,
    tipo: tipo || "Propietario",
    alicuotas: [],
    pagos: [],
  };

  residentes.push(nuevoResidente);
  res.status(201).json(nuevoResidente);
};

// Actualizar un residente por ID
const updateResidente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, nombreUsuario, email, contraseña, teléfono, tipo } = req.body;

  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  if (nombre) residente.nombre = nombre;
  if (apellido) residente.apellido = apellido;
  if (nombreUsuario) residente.nombreUsuario = nombreUsuario;
  if (email) residente.email = email;
  if (contraseña) residente.contraseña = contraseña;
  if (teléfono) residente.teléfono = teléfono;
  if (tipo) residente.tipo = tipo;

  res.json(residente);
};

// Eliminar un residente por ID
const deleteResidente = (req, res) => {
  const { id } = req.params;
  const index = residentes.findIndex((r) => r.ID === parseInt(id, 10));
  if (index === -1) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  const [eliminado] = residentes.splice(index, 1);
  res.json(eliminado);
};

// Asociar una alícuota a un residente
const associateAlicuotaToResidente = (req, res) => {
  const { residenteId, alicuotaId } = req.body;

  const residente = residentes.find((r) => r.ID === parseInt(residenteId, 10));
  const alicuota = alicuotas.find((a) => a.ID === parseInt(alicuotaId, 10));

  if (!residente || !alicuota) {
    return res.status(400).json({ error: "Residente o Alícuota no encontrado." });
  }

  try {
    residente.agregarAlicuota(alicuota);
    res.json(residente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener los pagos realizados por un residente
const getPagosByResidente = (req, res) => {
  const { id } = req.params; // ID del residente

  // Encontrar al residente por su ID
  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  // Formatear los pagos para que coincidan con el formato del frontend
  const pagosFormateados = residente.pagos.map((pago) => ({
    mes: pago.mes,
    anio: pago.anio,
    metodoPago: pago.metodoPago,
    monto: `$${pago.monto}`, // Formato con símbolo de dólar
    aplicaMulta: pago.multa.aplica ? "Sí" : "No",
    valorMulta: `$${pago.multa.valor}`,
    descripcionMulta: pago.multa.descripcion,
    deuda: `$${pago.deuda}`,
    abono: `$${pago.abono}`,
    estado: pago.estado,
    valorAlicuota: `$${pago.valorAlicuota}`,
  }));

  res.status(200).json(pagosFormateados);
};


const registrarPago = (req, res) => {
  const { id } = req.params;
  const { alicuotaID, mes, anio, metodoPago, monto, multa = {}, deuda = 0, abono = 0, estado } = req.body;

  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  // Validar y asignar valores predeterminados
  const montoPagado = isNaN(parseFloat(monto)) ? 0 : parseFloat(monto);
  const valorMulta = isNaN(parseFloat(multa.valor)) ? 0 : parseFloat(multa.valor);

  const nuevoPago = {
    alicuotaID,
    mes,
    anio,
    metodoPago,
    monto: montoPagado,
    multa: {
      aplica: multa.aplica || false,
      valor: valorMulta,
      descripcion: multa.descripcion || "N/A",
    },
    deuda: parseFloat(deuda),
    abono: parseFloat(abono),
    estado: estado || "Pendiente",
  };

  residente.pagos.push(nuevoPago);
  res.status(201).json({ message: "Pago registrado con éxito.", pago: nuevoPago });
};



const updatePagoByResidente = (req, res) => {
  const { id } = req.params; // ID del residente
  const { mes, anio, metodoPago, monto, multa, deuda, abono, estado } = req.body;

  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  // Buscar el pago por mes y año
  const pago = residente.pagos.find((p) => p.mes === mes && p.anio === anio);
  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado para el mes y año proporcionados." });
  }

  // Actualizar los campos del pago con los valores proporcionados
  pago.metodoPago = metodoPago || pago.metodoPago;
  pago.monto = parseFloat(monto) || pago.monto;
  pago.multa = {
    aplica: multa.aplica || pago.multa.aplica,
    valor: parseFloat(multa.valor) || pago.multa.valor,
    descripcion: multa.descripcion || pago.multa.descripcion,
  };
  pago.deuda = parseFloat(deuda) || pago.deuda;
  pago.abono = parseFloat(abono) || pago.abono;
  pago.estado = estado || pago.estado;

  res.status(200).json(pago); // Retornar el pago modificado
};


// Buscar un pago por mes y año para un residente
const getPagoByMesYAnio = (req, res) => {
  const { id } = req.params; // ID del residente
  const { mes, anio } = req.query; // Mes y año como parámetros de consulta

  // Buscar al residente por ID
  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  // Buscar el pago correspondiente por mes y año
  const pago = residente.pagos.find(
    (p) => p.mes === mes && p.anio === parseInt(anio, 10)
  );

  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado para el mes y año especificados." });
  }

  res.status(200).json(pago); // Retornar el pago encontrado
};


// Buscar un pago por mes y año y devolver toda la información del pago
const getPagoParaModificar = (req, res) => {
  const { id } = req.params;
  const { mes, anio } = req.query;

  const residente = residentes.find((r) => r.ID === parseInt(id, 10));
  if (!residente) {
    return res.status(404).json({ error: "Residente no encontrado." });
  }

  const pago = residente.pagos.find((p) => p.mes === mes && p.anio === parseInt(anio, 10));
  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado para el mes y año especificados." });
  }

  res.json(pago);
};


module.exports = {
  getAllResidentes,
  getResidenteById,
  createResidente,
  updateResidente,
  deleteResidente,
  associateAlicuotaToResidente,
  getPagosByResidente,
  loginResidente,
  registrarPago,
  updatePagoByResidente,
  getPagoByMesYAnio,
  getPagoParaModificar,
};
