const { v4: uuidv4 } = require("uuid");
const { Servicio } = require("./servicioModel");

class Alicuota {
  constructor(ID, servicios = [], mes, anio, fechaLimitePago) {
    this.ID = ID || uuidv4();
    this.servicios = servicios;
    this.monto = this.calcularMonto();
    this.mes = mes;
    this.anio = anio;
    this.fechaLimitePago = fechaLimitePago;
  }

  calcularMonto() {
    return this.servicios.reduce((total, servicio) => {
      if (!(servicio instanceof Servicio)) {
        throw new Error("El objeto proporcionado no es una instancia válida de Servicio.");
      }
      return total + servicio.costo;
    }, 0);
  }
}

// Stub datos simulados
const alicuotas = [
  new Alicuota("1", [new Servicio(1, "Limpieza de áreas comunes", 5), new Servicio(2, "Seguridad", 7)], "12", "2024", "2024-12-31"),
  new Alicuota("2", [new Servicio(3, "Consumo de agua", 10), new Servicio(4, "Consumo de luz", 12)], "12", "2024", "2024-12-31"),
  new Alicuota("3", [new Servicio(5, "Mantenimiento de áreas verdes", 8)], "12", "2024", "2024-12-31"),
];

module.exports = { Alicuota, alicuotas };
