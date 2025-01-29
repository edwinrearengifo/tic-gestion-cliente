import React, { useState, useEffect } from "react";
import axios from "axios";
import "../views/styles/MonitoreoDeAlicuotas.css";

const mesesMap = {
  Enero: "1",
  Febrero: "2",
  Marzo: "3",
  Abril: "4",
  Mayo: "5",
  Junio: "6",
  Julio: "7",
  Agosto: "8",
  Septiembre: "9",
  Octubre: "10",
  Noviembre: "11",
  Diciembre: "12",
};

const MonitoreoDeAlicuotas = () => {
  const [residentes, setResidentes] = useState([]);
  const [pagosFiltrados, setPagosFiltrados] = useState([]);
  const [mes, setMes] = useState("Enero");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());

  // Función para obtener los residentes desde la API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/residentes")
      .then((response) => {
        setResidentes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  // Función para manejar el filtro al hacer clic en el botón Buscar
  const handleBuscar = () => {
    const mesSeleccionado = mes; // Mes en texto (Enero, Febrero, etc.)
    const pagos = [];

    residentes.forEach((residente) => {
      residente.pagos.forEach((pago) => {
        if (pago.mes === mesSeleccionado && pago.anio.toString() === anio) {
          pagos.push({
            nombre: residente.nombre,
            apellido: residente.apellido,
            email: residente.email,
            telefono: residente.teléfono,
            metodoPago: pago.metodoPago,
            monto: pago.monto,
            aplicaMulta: pago.multa.aplica ? "Sí" : "No",
            valorMulta: pago.multa.valor,
            descripcionMulta: pago.multa.descripcion,
            deuda: pago.deuda,
            abono: pago.abono,
            estadoPago: pago.estado,
          });
        }
      });
    });

    setPagosFiltrados(pagos);
  };

  return (
    <div>
      <h1 className="mainTitle">Resumen de estado de Alícuotas</h1>
      <div className="filters">
        <label>
          Mes
          <select value={mes} onChange={(e) => setMes(e.target.value)}>
            {Object.keys(mesesMap).map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </label>
        <label>
          Año
          <select value={anio} onChange={(e) => setAnio(e.target.value)}>
            {[2025, 2024, 2023].map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <div className="buscar-button-container">
          <button onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>


      <div className="tableContainer">
        <table className="summaryTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Método de Pago</th>
              <th>Monto</th>
              <th>Aplica Multa</th>
              <th>Valor Multa</th>
              <th>Descripción Multa</th>
              <th>Deuda</th>
              <th>Abono</th>
              <th>Estado de Pago</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.length > 0 ? (
              pagosFiltrados.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.nombre}</td>
                  <td>{pago.apellido}</td>
                  <td>{pago.email}</td>
                  <td>{pago.telefono}</td>
                  <td>{pago.metodoPago}</td>
                  <td>{pago.monto}</td>
                  <td>{pago.aplicaMulta}</td>
                  <td>{pago.valorMulta}</td>
                  <td>{pago.descripcionMulta}</td>
                  <td>{pago.deuda}</td>
                  <td>{pago.abono}</td>
                  <td>{pago.estadoPago}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No hay pagos registrados para este mes y año.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoreoDeAlicuotas;
