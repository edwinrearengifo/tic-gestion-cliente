import React, { useState, useEffect } from "react";
import "../views/styles/GestionDeAlicuotas.css";

const GestionDeAlicuotas = ({valorAlicuota}) => {
  const [residentes, setResidentes] = useState([]); // Lista de residentes
  const [selectedResidente, setSelectedResidente] = useState(null); // Residente seleccionado
  const [servicios, setServicios] = useState([]); // Lista de servicios
  const [pagos, setPagos] = useState([]); // Estado para almacenar los pagos
  const [pago, setPago] = useState({
    mes: "Enero",
    anio: new Date().getFullYear(),
    montoPagado: 0,
    metodoPago: "Efectivo",
    multa: "No",
    valorMulta: 0,
    descripcionMulta: "N/A",
    deuda: 0,
    abono: 0,
    estado: "Pendiente",
  });
  const [valoresPendientes, setValoresPendientes] = useState({
    deudaPendiente: 0,
    abonoPendiente: 0,
  });



  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [mostrarFormularioModificar, setMostrarFormularioModificar] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(""); // Para mostrar el mensaje de error
  const [pagosPorResidente, setPagosPorResidente] = useState({});


  // SECCIÓN DE FUNCIONES

  const handleAbrirFormularioPago = () => {
    setMostrarFormularioPago(true);
    setPago({
      mes: "Enero",
      anio: new Date().getFullYear(),
      montoPagado: 0,
      metodoPago: "Efectivo",
      multa: "No",
      valorMulta: 0,
      descripcionMulta: "N/A",
      deuda: 0,
      abono: 0,
      estado: "Pendiente",
    });
  };

  const handleMostrarFormularioModificar = () => {
    setPagoEncontrado(false); // Reiniciar el estado para mostrar el formulario de búsqueda
    setPago({
      ...pago,
      mes: "Enero",
      anio: new Date().getFullYear(),
      montoPagado: 0,
      metodoPago: "Efectivo",
      multa: "No",
      valorMulta: 0,
      descripcionMulta: "N/A",
      deuda: 0,
      abono: 0,
      estado: "Pendiente",
    });
    setMostrarFormularioModificar(true); // Mostrar el formulario de modificar pago
  };


  // Cargar la lista de residentes
  useEffect(() => {
    const fetchResidentes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/residentes");
        const data = await response.json();
        setResidentes(data);
      } catch (error) {
        console.error("Error al cargar los residentes:", error);
      }
    };
    fetchResidentes();
  }, []);

  // Cargar la lista de servicios
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/servicios");
        const data = await response.json();
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      }
    };
    fetchServicios();
  }, []);


  const handleSeleccionarResidente = async (residente) => {
    setSelectedResidente(residente);

    if (pagosPorResidente[residente.ID]) {
      // Carga los datos previamente guardados en el estado
      setPagos(pagosPorResidente[residente.ID].pagos);
      setValoresPendientes(pagosPorResidente[residente.ID].valoresPendientes);
    } else {
      try {
        const response = await fetch(`http://localhost:5000/api/residentes/${residente.ID}/pagos`);

        if (response.ok) {
          const pagosResidente = await response.json();

          // Calcular deuda y abono acumulados
          const deudaAcumulada = pagosResidente.reduce((acc, pago) => acc + pago.deuda, 0);
          const abonoAcumulado = pagosResidente.reduce((acc, pago) => acc + pago.abono, 0);

          setValoresPendientes({
            deudaPendiente: deudaAcumulada,
            abonoPendiente: abonoAcumulado,
          });

          setPagos(pagosResidente); // Actualiza la lista de pagos en el frontend
        } else {
          alert("Error al obtener los pagos del residente.");
        }
      } catch (error) {
        console.error("Error al seleccionar residente:", error);
        alert("Hubo un error al intentar cargar los datos del residente.");
      }
    }

  };

  const calcularValorAlicuota = () => {
    return servicios.reduce((total, servicio) => total + parseFloat(servicio.costo || 0), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPago((prevPago) => {
      // Ajustar valores acumulados visuales
      const deudaPendienteVisual = Math.max(valoresPendientes.deudaPendiente, 0);
      const abonoPendienteVisual = Math.max(valoresPendientes.abonoPendiente, 0);

      const valorTotalIncluidoAcumulados =
        calcularValorAlicuota() +
        parseFloat(prevPago.valorMulta || 0) +
        valoresPendientes.deudaPendiente -
        valoresPendientes.abonoPendiente;


      const valorAlicuotaConMulta = calcularValorAlicuota() + parseFloat(prevPago.valorMulta || 0);

      // Calcular valor total ajustado considerando valores acumulados
      const valorTotalAjustado = valorAlicuotaConMulta + deudaPendienteVisual - abonoPendienteVisual;
      const nuevoMontoPagado = name === "montoPagado" ? parseFloat(value || 0) : prevPago.montoPagado;

      return {
        ...prevPago,
        [name]: value,
        deuda:
          name === "montoPagado"
            ? Math.max(valorTotalIncluidoAcumulados - nuevoMontoPagado, 0)
            : prevPago.deuda,
        abono:
          name === "montoPagado"
            ? Math.max(nuevoMontoPagado - valorTotalIncluidoAcumulados, 0)
            : prevPago.abono,
        estado:
          name === "montoPagado"
            ? nuevoMontoPagado >= valorTotalIncluidoAcumulados
              ? nuevoMontoPagado > valorTotalIncluidoAcumulados
                ? "Pagado + Abono"
                : "Pagado Completo"
              : "Pagado Parcial"
            : prevPago.estado,
        valorTotalAjustado,
      };
    });
    // Limpiar el mensaje de error al cambiar los campos
    if (name === "mes" || name === "anio") {
      setErrorMensaje("");
    }
  };



  const valorTotal = calcularValorAlicuota() + parseFloat(pago.valorMulta || 0);

  const handleRegistrarPago = async () => {
    if (!selectedResidente) {
      alert("Por favor, selecciona un residente.");
      return;
    }
    // Verifica si ya existe un pago para el mes y año seleccionados
    const existe = pagos.find(
      (p) => p.mes === pago.mes && parseInt(p.anio) === parseInt(pago.anio)
    );
    if (existe) {
      setErrorMensaje(
        "Ya existe un registro de pago para este mes y año. Por favor, ingrese otro registro."
      );
      return;
    }

    const deudaPendiente = Math.max(valoresPendientes.deudaPendiente, 0);
    const abonoPendiente = Math.max(valoresPendientes.abonoPendiente, 0);
    // Calcula el valor total incluyendo los valores acumulados
    const valorTotalIncluidoAcumulados =
      valorTotal + deudaPendiente - abonoPendiente;

    const nuevoAbono = Math.max(pago.montoPagado - valorTotalIncluidoAcumulados, 0);
    const nuevaDeuda = Math.max(valorTotalIncluidoAcumulados - pago.montoPagado, 0);


    // Cálculo de valores dinámicos
    const valorAlicuota = calcularValorAlicuota();
    const valorMulta = parseFloat(pago.valorMulta || 0);
    const montoPagado = parseFloat(pago.montoPagado || 0);
    const deuda = Math.max(valorAlicuota + valorMulta - montoPagado, 0);
    const abono = Math.max(montoPagado - (valorAlicuota + valorMulta), 0);

    // Actualizar valores pendientes
    setValoresPendientes((prevValoresPendientes) => {
      const nuevaDeuda = prevValoresPendientes.deudaPendiente + deuda - abono;
      const nuevoAbono = prevValoresPendientes.abonoPendiente + abono - deuda;

      console.log("Actualizando valores pendientes:");
      console.log("Deuda Pendiente:", nuevaDeuda);
      console.log("Abono Pendiente:", nuevoAbono);

      return {
        deudaPendiente: nuevaDeuda,
        abonoPendiente: nuevoAbono,
      };
    });


    // Crear el objeto de pago
    const nuevoPago = {
      residenteID: selectedResidente.ID,
      alicuotaID: "1",
      mes: pago.mes,
      anio: pago.anio,
      metodoPago: pago.metodoPago,
      monto: parseFloat(pago.montoPagado || 0),

      multa: {
        aplica: pago.multa === "Sí",
        valor: parseFloat(pago.valorMulta) || 0,
        descripcion: pago.descripcionMulta,
      },
      deuda: Math.max(valoresPendientes.deudaPendiente + calcularValorAlicuota() - pago.montoPagado, 0),

      abono: Math.max(pago.montoPagado - calcularValorAlicuota(), 0),
      estado:
        pago.montoPagado >= valorTotalIncluidoAcumulados
          ? pago.montoPagado > valorTotalIncluidoAcumulados
            ? "Pagado + Abono"
            : "Pagado Completo"
          : "Pagado Parcial",
    };
    console.log("Pagos:", pagos);


    try {
      const response = await fetch(`http://localhost:5000/api/residentes/${selectedResidente.ID}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPago),
      });

      if (response.ok) {
        
        alert("Pago registrado con éxito.");
        setMostrarFormularioPago(false);

        // Actualiza los estados locales
        setPagos((prev) => [...prev, nuevoPago]);
        setValoresPendientes({
          deudaPendiente: nuevaDeuda,
          abonoPendiente: nuevoAbono,
        });

        // Actualizar el estado pagos localmente
        setPagosPorResidente((prev) => ({
          ...prev,
          [selectedResidente.ID]: {
            pagos: [...(prev[selectedResidente.ID]?.pagos || []), nuevoPago],
            valoresPendientes: {
              deudaPendiente: nuevaDeuda,
              abonoPendiente: nuevoAbono,
            },
          },
        }));
      } else {
        const errorData = await response.json();
        alert(`Error al registrar el pago: ${errorData.message}`);

      }

    } catch (error) {
      console.error("Error al registrar el pago:", error);
      alert("Hubo un error al intentar registrar el pago.");
    }
  };

  const handleMostrarPagos = async (residente) => {
    const residenteID = residente ? residente.ID : selectedResidente?.ID;

    if (!residenteID) {
      alert("Por favor, selecciona un residente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/residentes/${residenteID}/pagos`);
      if (response.ok) {
        const data = await response.json();
        console.log("Pagos obtenidos:", data); // <-- Agrega este log
        setPagos(data); // Actualiza el estado con los pagos obtenidos
      } else {
        alert("Error al obtener los pagos.");
      }
    } catch (error) {
      console.error("Error al mostrar los pagos:", error);
      alert("Hubo un error al intentar obtener los pagos.");
    }
  };

  const [pagoEncontrado, setPagoEncontrado] = useState(false);

  const handleBuscarPago = async () => {
    if (!selectedResidente) {
      alert("Por favor, selecciona un residente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/residentes/${selectedResidente.ID}/pago-para-modificar?mes=${pago.mes}&anio=${pago.anio}`);

      if (response.ok) {
        const data = await response.json();
        setPago({
          ...data,
          montoPagado: data.monto,
          multa: data.multa.aplica ? "Sí" : "No",
          valorMulta: data.multa.valor,
          descripcionMulta: data.multa.descripcion,
        });
        setPagoEncontrado(true); // Mostrar el formulario completo
      } else {
        alert("No se encontró ningún pago para el mes y año seleccionados.");
      }
    } catch (error) {
      console.error("Error al buscar el pago:", error);
      alert("Hubo un error al intentar buscar el pago.");
    }
  };



  const handleConfirmarModificacion = async () => {
    if (!selectedResidente) {
      alert("Por favor, selecciona un residente.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/residentes/${selectedResidente.ID}/pagos`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mes: pago.mes,
            anio: pago.anio,
            monto: parseFloat(pago.montoPagado),
            metodoPago: pago.metodoPago,
            multa: {
              aplica: pago.multa === "Sí",
              valor: parseFloat(pago.valorMulta),
              descripcion: pago.descripcionMulta,
            },
            deuda: parseFloat(pago.deuda),
            abono: parseFloat(pago.abono),
            estado: pago.estado,
          }),
        }
      );

      if (response.ok) {
        alert("Pago modificado con éxito.");
        setMostrarFormularioModificar(false); // Ocultar el formulario
        await handleMostrarPagos(selectedResidente);
      } else {
        alert("Error al modificar el pago.");
      }
    } catch (error) {
      console.error("Error al modificar el pago:", error);
      alert("Hubo un error al intentar modificar el pago.");
    }
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Alícuotas</h2>

      {/* Lista de residentes */}
      <div className="residentes-table-container">
        <h3>Lista de Residentes</h3>
        <table className="residentes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {residentes.map((residente) => (
              <tr key={residente.ID}>
                <td>{residente.nombre}</td>
                <td>{residente.apellido}</td>
                <td>{residente.email}</td>
                <td>{residente.teléfono}</td>
                <td>
                  <button
                    className="select-button"
                    onClick={() => handleSeleccionarResidente(residente)}
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cuadros del residente y valor de la alícuota */}
      {selectedResidente && (
        <div className="middle-section">
          <div className="residente-info">
            <h3>Información del Residente</h3>
            <p><strong>Nombre:</strong> {selectedResidente.nombre}</p>
            <p><strong>Apellido:</strong> {selectedResidente.apellido}</p>
            <p><strong>Email:</strong> {selectedResidente.email}</p>
            <p><strong>Teléfono:</strong> {selectedResidente.teléfono}</p>

            <div className="buttons">
              <button onClick={handleAbrirFormularioPago}>Registrar Pago</button>


              <button onClick={handleMostrarFormularioModificar}>Modificar Pago</button>


            </div>
          </div>

          <div className="valor-alicuota">
            <h3>Valor de Alícuota</h3>
            <p>${calcularValorAlicuota()}</p>
          </div>
        </div>
      )}

      {/* Registrar Pago y Detalles del Pago */}
      {mostrarFormularioPago && (
        <div className="payment-section">
          <div className="registrar-pago">
            <h3>Registrar Pago</h3>
            <form className="pago-form">
              <label>
                Mes:
                <select name="mes" value={pago.mes} onChange={handleInputChange}>
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </label>

              <label>
                Año:
                <input
                  type="number"
                  name="anio"
                  value={pago.anio}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Multa:
                <select name="multa" value={pago.multa} onChange={handleInputChange}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </label>

              {pago.multa === "Sí" && (
                <>
                  <label>
                    Valor de Multa:
                    <input
                      type="number"
                      name="valorMulta"
                      value={pago.valorMulta}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Descripción de Multa:
                    <input
                      type="text"
                      name="descripcionMulta"
                      value={pago.descripcionMulta}
                      onChange={handleInputChange}
                    />
                  </label>
                </>
              )}

              <label>
                Monto Pagado:
                <input
                  type="number"
                  name="montoPagado"
                  value={pago.montoPagado}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Método de Pago:
                <select name="metodoPago" value={pago.metodoPago} onChange={handleInputChange}>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </label>

              <div className="payment-buttons">
                <button type="button" onClick={handleRegistrarPago}>Confirmar Pago</button>
                <button type="button" onClick={() => setMostrarFormularioPago(false)}>Cancelar</button>
              </div>
              {/* Mensaje de error si ya tiene un pago registrado*/}
              {errorMensaje && <p className="error-message">{errorMensaje}</p>}
            </form>
          </div>

          <div className="detalles-pago">
            <h3>Detalles del Pago</h3>
            <p><strong>Valor Total (Alícuota + Multa):</strong> ${valorTotal}</p>
            <p><strong>Deuda:</strong> ${Math.max(pago.deuda, 0)}</p>
            <p><strong>Abono:</strong> ${Math.max(pago.abono, 0)}</p>
            <p><strong>Estado del Pago:</strong> {pago.estado}</p>

            <hr className="separator" /> {/* Línea horizontal */}

            <h4>Valores Acumulados</h4>
            <p><strong>Deuda Acumulada:</strong> ${Math.max(valoresPendientes.deudaPendiente, 0)}</p>
            <p><strong>Abono Acumulado:</strong> ${Math.max(valoresPendientes.abonoPendiente, 0)}</p>

            {pago.montoPagado > 0 && valoresPendientes.deudaPendiente > 0 && (
              <p style={{ color: "red", textAlign: "center" }}>
                Se aplicará la deuda acumulada al nuevo registro.
              </p>
            )}
            {pago.montoPagado > 0 && valoresPendientes.abonoPendiente > 0 && (
              <p style={{ color: "green", textAlign: "center" }}>
                Se aplicará el abono acumulado al nuevo registro.
              </p>
            )}

            <hr className="separator" /> {/* Línea horizontal */}

            <h4>Valor Total Incluido Valores Acumulados:</h4>
            <p><strong>${pago.valorTotalAjustado}</strong></p>
          </div>

        </div>
      )}

      {mostrarFormularioModificar && (
        <div className="modificar-pago-container">
          {/* Formulario de Modificar Pago */}
          <div className="modificar-pago-form-section">
            <h3>Buscar y Modificar Pago</h3>

            {!pagoEncontrado ? (
              <form className="buscar-pago-form">
                <label>
                  Mes:
                  <select name="mes" value={pago.mes} onChange={handleInputChange}>
                    {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                      <option key={mes} value={mes}>{mes}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Año:
                  <input
                    type="number"
                    name="anio"
                    value={pago.anio}
                    onChange={handleInputChange}
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </label>

                <button type="button" onClick={handleBuscarPago}>Buscar</button>
                <button type="button" onClick={() => setMostrarFormularioModificar(false)}>Cancelar</button>
              </form>

            ) : (
              <form className="modificar-pago-form">
                <label>
                  Mes:
                  <select name="mes" value={pago.mes} onChange={handleInputChange}>
                    {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes) => (
                      <option key={mes} value={mes}>{mes}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Año:
                  <input
                    type="number"
                    name="anio"
                    value={pago.anio}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Monto Pagado:
                  <input
                    type="number"
                    name="montoPagado"
                    value={pago.montoPagado}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Método de Pago:
                  <select name="metodoPago" value={pago.metodoPago} onChange={handleInputChange}>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </label>

                <label>
                  Multa:
                  <select name="multa" value={pago.multa} onChange={handleInputChange}>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </label>

                {pago.multa === "Sí" && (
                  <>
                    <label>
                      Valor de Multa:
                      <input
                        type="number"
                        name="valorMulta"
                        value={pago.valorMulta}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Descripción de Multa:
                      <input
                        type="text"
                        name="descripcionMulta"
                        value={pago.descripcionMulta}
                        onChange={handleInputChange}
                      />
                    </label>
                  </>
                )}

                <div className="modificar-pago-buttons">
                  <button type="button" onClick={handleConfirmarModificacion}>Confirmar Modificación</button>
                  <button type="button" onClick={() => setMostrarFormularioModificar(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </div>

          {/* Cuadro de detalles del pago */}
          <div className="detalles-pago-section">
            <h3>Detalles del Pago</h3>
            <p><strong>Valor Total (Alícuota + Multa):</strong> ${valorTotal}</p>
            <p><strong>Deuda:</strong> ${Math.max(pago.deuda, 0)}</p>
            <p><strong>Abono:</strong> ${Math.max(pago.abono, 0)}</p>
            <p><strong>Estado del Pago:</strong> {pago.estado}</p>

            <hr /> {/* Línea horizontal separadora */}

            <h4>Valores Acumulados</h4>
            <p><strong>Deuda Acumulada:</strong> ${Math.max(valoresPendientes.deudaPendiente, 0)}</p>
            <p><strong>Abono Acumulado:</strong> ${Math.max(valoresPendientes.abonoPendiente, 0)}</p>
            {pago.montoPagado > 0 && valoresPendientes.deudaPendiente > 0 && (
              <p style={{ color: "red" }}>
                Se aplicará la deuda acumulada al nuevo registro.
              </p>
            )}
            {pago.montoPagado > 0 && valoresPendientes.abonoPendiente > 0 && (
              <p style={{ color: "green" }}>
                Se aplicará el abono acumulado al nuevo registro.
              </p>
            )}
            <hr /> {/* Línea horizontal separadora */}
            <h4>Valor Total Incluido Valores Acumulados:</h4>
            <p><strong>${pago.valorTotalAjustado}</strong></p>
          </div>
        </div>
      )}

      {selectedResidente && pagos.length > 0 ? (
        <div className="historial-pagos">
          <h3>Historial de Pagos</h3>
          <table className="pagos-table">
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
                  <td>{pago.aplicaMulta === "Sí" ? "Sí" : "No"}</td>
                  <td>{pago.valorMulta || 0}</td>
                  <td>{pago.descripcionMulta || "N/A"}</td>
                  <td>{pago.deuda}</td>
                  <td>{pago.abono}</td>
                  <td>{pago.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay pagos registrados para este residente.</p>
      )}


    </div>
  );
};

export default GestionDeAlicuotas;
