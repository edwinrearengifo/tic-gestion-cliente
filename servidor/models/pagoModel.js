const { v4: uuidv4 } = require("uuid");

class Pago {
  constructor(
    ID,
    residenteID,
    alicuotaID,
    mes,
    anio,
    metodoPago,
    monto,
    multa = { aplica: false, valor: 0, descripcion: "N/A" },
    deuda = 0,
    abono = 0,
    estado = "Pendiente",
    valorAlicuota
  ) {
    this.ID = ID || uuidv4();
    this.residenteID = residenteID;
    this.alicuotaID = alicuotaID;
    this.mes = mes;
    this.anio = anio;
    this.metodoPago = metodoPago;
    this.monto = monto;
    this.multa = multa;
    this.deuda = deuda;
    this.abono = abono;
    this.estado = estado;
    this.valorAlicuota = valorAlicuota;
  }

  actualizarEstado() {
    const totalRequerido =
      this.valorAlicuota + this.multa.valor + this.deuda - this.abono;

    if (this.monto >= totalRequerido) {
      this.estado =
        this.monto > totalRequerido ? "Pagado + Abono" : "Pagado Completo";
    } else if (this.monto > 0) {
      this.estado = "Pagado Parcial";
    } else {
      this.estado = "Pendiente";
    }
  }
}

// Datos simulados
const pagos = [
  new Pago("1", "1", "1", "12", "2024", "Transferencia", 12, { aplica: false }, 0, 0, "Pagado"),
  new Pago("2", "2", "2", "12", "2024", "Efectivo", 22, { aplica: true, valor: 5, descripcion: "Multa por atraso" }, 0, 0, "Pagado"),
  new Pago("3", "3", "3", "12", "2024", "Transferencia", 8, { aplica: false }, 0, 0, "Pendiente"),
];

module.exports = { Pago, pagos };
