import React, { useEffect, useState, useCallback } from "react";

import "../views/styles/GestionDeServicios.css";

const GestionDeServicios = ({ setValorAlicuota }) => {
  const [servicios, setServicios] = useState([]); // Lista de servicios existentes
  const [isAdding, setIsAdding] = useState(false); // Controla si se está agregando un servicio
  const [isEditing, setIsEditing] = useState(false); // Controla si se está editando un servicio
  const [newService, setNewService] = useState({ nombre: "", costo: "" }); // Datos del nuevo servicio
  const [selectedService, setSelectedService] = useState(null); // Servicio seleccionado para editar
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para autocompletar
  const [isDeleting, setIsDeleting] = useState(false); // Controla si se está eliminando un servicio

  // Base URL del backend
  const BASE_URL = "http://localhost:5000/api/servicios";

  // Función para cargar los servicios desde el backend
  const fetchServicios = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setServicios(data);

      // Calcular el valor total de la alícuota
      const valorTotal = data.reduce(
        (total, servicio) => total + parseFloat(servicio.costo || 0),
        0
      );

      setValorAlicuota(valorTotal); // Actualizar el estado del padre
    } catch (error) {
      console.error("Error al cargar los servicios:", error);
    }
  }, [BASE_URL, setValorAlicuota]);

  // Cargar los servicios al montar el componente
  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedService({ ...selectedService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  // Función para agregar un nuevo servicio
  const handleAddService = async () => {
    if (newService.nombre.trim() === "" || newService.costo.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Servicio agregado con éxito.");
        const nuevosServicios = [...servicios, data];
        setServicios(nuevosServicios);

        // Calcular el nuevo valor total de la alícuota
        const valorTotal = nuevosServicios.reduce(
          (total, servicio) => total + parseFloat(servicio.costo || 0),
          0
        );

        setValorAlicuota(valorTotal); // Actualizar el estado del padre
        setNewService({ nombre: "", costo: "" });
        setIsAdding(false);
      } else {
        alert(data.error || "No se pudo agregar el servicio.");
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      alert("Error al agregar el servicio.");
    }
  };

  // Función para iniciar la edición de un servicio
  const handleEditService = () => {
    setIsEditing(true); // Habilita el formulario de edición
  };

  // Función para seleccionar un servicio con autocompletado
  const handleSelectService = (service) => {
    setSelectedService(service); // Selecciona el servicio para editar
    setSearchTerm(service.nombre); // Actualiza el término de búsqueda
  };

  // Función para guardar los cambios en un servicio
  const handleSaveChanges = async () => {
    if (
      selectedService.nombre.trim() === "" ||
      selectedService.costo.trim() === ""
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${selectedService.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedService),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Servicio actualizado con éxito.");
        const nuevosServicios = servicios.map((servicio) =>
          servicio.ID === selectedService.ID ? data : servicio
        );
        setServicios(nuevosServicios);

        // Calcular el nuevo valor total de la alícuota
        const valorTotal = nuevosServicios.reduce(
          (total, servicio) => total + parseFloat(servicio.costo || 0),
          0
        );

        setValorAlicuota(valorTotal); // Actualizar el estado del padre
        setIsEditing(false);
        setSelectedService(null);
      } else {
        alert(data.error || "No se pudo actualizar el servicio.");
      }
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
      alert("Error al actualizar el servicio.");
    }
  };


  // Función para cancelar la edición o agregar
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedService(null);
    setSearchTerm("");
  };

  // Función para habilitar el borrado
  const handleDeleteService = () => {
    setIsDeleting(true); // Habilita el formulario de borrado
  };

  // Función para confirmar el borrado de un servicio
  const handleConfirmDelete = async () => {
    if (!selectedService) {
      alert("Por favor, selecciona un servicio para eliminar.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${selectedService.ID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Servicio eliminado con éxito.");
        const nuevosServicios = servicios.filter(
          (servicio) => servicio.ID !== selectedService.ID
        );
        setServicios(nuevosServicios);

        // Calcular el nuevo valor total de la alícuota
        const valorTotal = nuevosServicios.reduce(
          (total, servicio) => total + parseFloat(servicio.costo || 0),
          0
        );

        setValorAlicuota(valorTotal); // Actualizar el estado del padre
        setIsDeleting(false);
        setSelectedService(null);
      } else {
        alert("No se pudo eliminar el servicio.");
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      alert("Error al eliminar el servicio.");
    }
  };


  // Función para cancelar el borrado
  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSelectedService(null);
    setSearchTerm(""); // Limpia el término de búsqueda
  };

  return (
    <div className="gestionServicios">
      {/* Título */}
      <h1 className="mainTitle">Gestión de Servicios de Alícuotas</h1>

      {/* Tabla de servicios actuales */}
      <div className="servicesSection">
        <div className="servicesTableContainer">
          <h2>Servicios Actuales</h2>
          <table className="servicesTable">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Valor</th>
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

        {/* Valor total */}
        <div className="totalValueContainer">
          <h2>Valor de Alícuota</h2>
          <p>${servicios.reduce((total, servicio) => total + parseFloat(servicio.costo || 0), 0)}</p>
        </div>
      </div>

      {/* Configuración de servicios */}
      <div className="servicesConfigSection">
        <h2>Configuración de servicios</h2>
        <div className="configButtons">
          <button className="addServiceButton" onClick={() => setIsAdding(true)}>
            Agregar Servicio
          </button>
          <button className="editServiceButton" onClick={handleEditService}>
            Modificar Servicio
          </button>
          <button className="deleteServiceButton" onClick={handleDeleteService}>
            Borrar Servicio
          </button>
        </div>

        {/* Formulario de agregar servicio */}
        {isAdding && (
          <div className="serviceDetailsForm">
            <h2>Agregar Servicio</h2>
            <form>
              <div className="formGroup">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Servicio ..."
                  value={newService.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Valor</label>
                <input
                  type="number"
                  name="costo"
                  placeholder="$10"
                  value={newService.costo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formButtons">
                <button
                  type="button"
                  className="acceptButton"
                  onClick={handleAddService}
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  className="cancelButton"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario de modificar servicio */}
        {isEditing && (
          <div className="serviceDetailsForm">
            <h2>Editar Servicio</h2>
            <form>
              <div className="formGroup">
                <label>Buscar Servicio (ID o Nombre)</label>
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Escribe el ID o nombre del servicio"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Sugerencias */}
                <ul className="suggestionsList">
                  {servicios
                    .filter(
                      (s) =>
                        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.ID.toString().includes(searchTerm)
                    )
                    .map((s) => (
                      <li
                        key={s.ID}
                        onClick={() => handleSelectService(s)}
                        className="suggestionItem"
                      >
                        {s.ID} - {s.nombre}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedService && (
                <>
                  <div className="formGroup">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={selectedService.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Valor</label>
                    <input
                      type="number"
                      name="costo"
                      value={selectedService.costo}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              <div className="formButtons">
                <button
                  type="button"
                  className="acceptButton"
                  onClick={handleSaveChanges}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="cancelButton"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario de borrar servicio */}
        {isDeleting && (
          <div className="serviceDetailsForm">
            <h2>Borrar Servicio</h2>
            <form>
              <div className="formGroup">
                <label>Buscar Servicio (ID o Nombre)</label>
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Escribe el ID o nombre del servicio"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Sugerencias */}
                <ul className="suggestionsList">
                  {servicios
                    .filter(
                      (s) =>
                        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.ID.toString().includes(searchTerm)
                    )
                    .map((s) => (
                      <li
                        key={s.ID}
                        onClick={() => handleSelectService(s)}
                        className="suggestionItem"
                      >
                        {s.ID} - {s.nombre}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedService && (
                <div className="selectedServiceInfo">
                  <p>
                    <strong>Servicio Seleccionado:</strong> {selectedService.nombre}
                  </p>
                </div>
              )}
              <div className="formButtons">
                <button
                  type="button"
                  className="acceptButton"
                  onClick={handleConfirmDelete}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="cancelButton"
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionDeServicios;
