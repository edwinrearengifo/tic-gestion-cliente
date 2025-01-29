const { Pago } = require("./pagoModel");
const { Alicuota } = require("./alicuotaModel");

let currentID = 4; // Inicializa el contador para IDs secuenciales

class Residente {
  constructor(
    ID,
    nombre,
    apellido,
    nombreUsuario,
    email,
    contraseña,
    teléfono,
    tipo = "Propietario",
    alicuotas = [],
    pagos = []
  ) {
    this.ID = ID || currentID++; // Genera un ID numérico secuencial
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.email = email;
    this.contraseña = contraseña;
    this.teléfono = teléfono;
    this.tipo = tipo; // "Propietario" o "Arrendatario"
    this.alicuotas = alicuotas;
    this.pagos = pagos;
    this.abonosAcumulados = []; // Lista para abonos acumulados
    this.deudasAcumuladas = []; // Lista para deudas acumuladas
  }

  agregarAlicuota(alicuota) {
    if (!(alicuota instanceof Alicuota)) {
      throw new Error("La alícuota debe ser una instancia válida de Alicuota.");
    }
    this.alicuotas.push(alicuota);
  }

  registrarPago(pago, alicuota) {
    if (!(pago instanceof Pago)) {
      throw new Error("El pago debe ser una instancia válida de Pago.");
    }
    if (!this.alicuotas.some((a) => a.ID === alicuota.ID)) {
      throw new Error("La alícuota no está asociada a este residente.");
    }

    pago.actualizarEstado(alicuota.monto);
    this.pagos.push(pago);
  }

  obtenerPagos() {
    return this.pagos.map((pago) => ({
      ...pago,
      alicuota: this.alicuotas.find((a) => a.ID === pago.alicuotaID),
    }));
  }
}

// Validación para evitar duplicados
const validateUniqueUsername = (username) => {
  if (residentes.some((residente) => residente.nombreUsuario === username)) {
    throw new Error(`El nombre de usuario '${username}' ya está en uso.`);
  }
};

// Función para encontrar un residente por nombre de usuario y contraseña
const findResidente = (username, password) => {
  return residentes.find(
    (residente) =>
      residente.nombreUsuario === username && residente.contraseña === password
  );
};

// Datos simulados con IDs secuenciales
const residentes = [
  new Residente(1, "Juan", "Pérez", "residente1", "juan.perez@mail.com", "123456", "0987654321", "Propietario"),
  new Residente(2, "Ana", "López", "residente2", "ana.lopez@mail.com", "987654", "0987654322", "Arrendatario"),
  new Residente(3, "Carlos", "Ramírez", "residente3", "carlos.ramirez@mail.com", "789123", "0987654323", "Propietario"),
];

module.exports = { Residente, residentes, findResidente, validateUniqueUsername };
