class Servicio {
  constructor(ID, nombre, costo) {
    this.ID = ID; // Identificador único
    this.nombre = nombre; // Nombre del servicio
    this.costo = costo; // Costo del servicio
  }
}

// Datos simulados
const servicios = [
  new Servicio(1, "Limpieza de áreas comunes", 5),
  new Servicio(2, "Seguridad", 7),
  new Servicio(3, "Consumo de agua", 10),
  new Servicio(4, "Consumo de luz", 12),
  new Servicio(5, "Mantenimiento de áreas verdes", 8),
];

module.exports = { Servicio, servicios };
