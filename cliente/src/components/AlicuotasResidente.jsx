import React, { useEffect, useState, useCallback } from "react";
import "../views/styles/AlicuotasResidente.css";
import casa from "../img/casa.png";

const AlicuotasResidente = ({ residente }) => {
    const [servicios, setServicios] = useState([]); // Lista de servicios
    const [pagos, setPagos] = useState([]); // Lista de pagos del residente

    const fetchServicios = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/api/servicios");
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
        }
    }, []);

    const fetchPagos = useCallback(async () => {
        if (!residente || !residente.ID) {
            console.warn("El residente no está definido o no tiene un ID.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/residentes/${residente.ID}/pagos`);
            const data = await response.json();
            setPagos(data);
        } catch (error) {
            console.error("Error al cargar los pagos:", error);
        }
    }, [residente]);


    useEffect(() => {
        if (residente && residente.ID) {
            fetchServicios();
            fetchPagos();
        }
    }, [residente, fetchServicios, fetchPagos]);


    if (!residente) {
        return <p>Cargando datos del residente...</p>; // Mostrar un mensaje de carga mientras no hay datos
    }
    const calcularValorTotalAlicuota = () => {
        return servicios.reduce((total, servicio) => total + parseFloat(servicio.costo || 0), 0);
    };
    return (
        <div className="alicuotasResidente">
            <h1 className="mainTitle">Resumen de Alícuota Mensual</h1>
            <div className="detailsContainer">
                {/* Cuadro Izquierdo: Monto total y estado */}
                <div className="summaryBox">
                    <h2>Monto</h2>
                    <p className="amount">${calcularValorTotalAlicuota()}</p>
                    <p className="dueDate">Fecha de Vencimiento: viernes 31 de enero de 2025</p>
                    <p className="status">
                        Estado: <span className="statusComplete">Pagado Completo</span>
                    </p>
                </div>


                {/* Cuadro Derecho: Imagen de la vivienda */}
                <div className="imageBox">
                    <img src={casa} alt="Casa" className="houseImage" />
                </div>
            </div>

            <div className="servicesSection">
                {/* Div del título, ocupa la parte superior del cuadro blanco */}
                <div className="servicesHeader">
                    <h2 className="servicesTitle">Servicios Actuales</h2>
                </div>

                {/* Div de la tabla, ocupa la parte inferior del cuadro blanco */}
                <div className="servicesBody">
                    <table className="servicesTable">
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Costo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicios.map((servicio) => (
                                <tr key={servicio.ID}>
                                    <td>{servicio.nombre}</td>
                                    <td>${servicio.costo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Historial de Pagos */}
            <div className="historialPagosSection">
                <h2>Historial de Pagos</h2>
                {pagos.length > 0 ? (
                    <table className="pagosTable">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Año</th>
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
                            {pagos.map((pago, index) => (
                                <tr key={pago.ID || index}>
                                    <td>{pago.mes}</td>
                                    <td>{pago.anio}</td>
                                    <td>{pago.metodoPago}</td>
                                    <td>{pago.monto}</td>
                                    <td>{pago.multa?.aplica ? "Sí" : "No"}</td>
                                    <td>{pago.multa?.valor || 0}</td>
                                    <td>{pago.multa?.descripcion || "N/A"}</td>
                                    <td>{pago.deuda}</td>
                                    <td>{pago.abono}</td>
                                    <td>{pago.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay pagos registrados para este residente.</p>
                )}
            </div>
        </div>
    );
};

export default AlicuotasResidente;
