import React, { useEffect, useState } from "react";
import "../views/styles/GestionDeViviendas.css";

const GestionDeViviendas = () => {
  const [viviendas, setViviendas] = useState([]); // Lista de viviendas existentes
  const [residentes, setResidentes] = useState([]); // Lista de residentes disponibles
  const [isAdding, setIsAdding] = useState(false); // Controla si se está agregando una vivienda
  const [isEditing, setIsEditing] = useState(false); // Controla si se está editando una vivienda
  const [isDeleting, setIsDeleting] = useState(false); // Controla si se está eliminando una vivienda
  const [newHouse, setNewHouse] = useState({ numeracion: "", ocupanteID: "" }); // Datos de la nueva vivienda
  const [selectedHouse, setSelectedHouse] = useState(null); // Vivienda seleccionada para editar/borrar
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para modificar o borrar
  const [errors, setErrors] = useState({ numeracion: "", ocupanteID: "" });


  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsDeleting(false);
    setNewHouse({ numeracion: "", ocupanteID: "" });
    setSelectedHouse(null);
    setSearchTerm("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedHouse) {
      alert("Por favor, selecciona una vivienda para borrar.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/viviendas/${selectedHouse.ID}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setViviendas(
          viviendas.filter((vivienda) => vivienda.ID !== selectedHouse.ID)
        );
        setSelectedHouse(null);
        setIsDeleting(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al borrar la vivienda:", error);
    }
  };


  // Cargar las viviendas y los residentes al montar el componente
  const fetchData = async () => {
  try {
    // Obtener residentes
    const residentesResponse = await fetch("http://localhost:5000/api/residentes");
    const residentesData = await residentesResponse.json();
    console.log("Residentes:", residentesData); // Verifica los datos de residentes
    setResidentes(residentesData);

    // Obtener viviendas
    const viviendasResponse = await fetch("http://localhost:5000/api/viviendas");
    const viviendasData = await viviendasResponse.json();
    console.log("Viviendas:", viviendasData); // Verifica los datos de viviendas

    // Relacionar residentes con viviendas
    const updatedViviendas = viviendasData.map((vivienda) => {
      const residente = residentesData.find(
        (res) => String(res.ID) === String(vivienda.ocupanteID) // Compara como cadenas
      );
      return { ...vivienda, ocupante: residente || null };
    });

    console.log("Viviendas actualizadas:", updatedViviendas); // Verifica las viviendas con los residentes relacionados
    setViviendas(updatedViviendas);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};


  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHouse({ ...newHouse, [name]: value });
  };

  // Validar datos de una nueva vivienda
  const validateNewHouse = () => {
    let valid = true;
    let validationErrors = { numeracion: "", ocupanteID: "" };

    if (viviendas.some((vivienda) => vivienda.numeracion === newHouse.numeracion)) {
      validationErrors.numeracion = "Este número de casa ya está registrado.";
      valid = false;
    }

    if (
      newHouse.ocupanteID &&
      viviendas.some((vivienda) => vivienda.ocupanteID === newHouse.ocupanteID)
    ) {
      validationErrors.ocupanteID = "Este ocupante ya está asociado a otra vivienda.";
      valid = false;
    }

    setErrors(validationErrors);
    return valid;
  };
  

  // Función para agregar una vivienda
  const handleAddHouse = async () => {
    if (!validateNewHouse()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/viviendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHouse),
      });
      const data = await response.json();

      if (response.ok) {
        const updatedResidente = residentes.find((res) => res.ID === data.vivienda.ocupanteID);
        const updatedVivienda = { ...data.vivienda, ocupante: updatedResidente || null };

        setViviendas([...viviendas, updatedVivienda]);
        setNewHouse({ numeracion: "", ocupanteID: "" });
        setIsAdding(false);
        setErrors({ numeracion: "", ocupanteID: "" });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al agregar la vivienda:", error);
    }
  };

  // Función para guardar cambios en una vivienda existente
  const handleSaveChanges = async () => {
    if (!selectedHouse) {
      alert("Por favor, selecciona una vivienda para modificar.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/viviendas/${selectedHouse.ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedHouse),
        }
      );
      const data = await response.json();
  
      if (response.ok) {
        // Buscar el residente relacionado
        const updatedResidente = residentes.find(
          (res) => String(res.ID) === String(data.vivienda.ocupanteID)
        );
        const updatedVivienda = { ...data.vivienda, ocupante: updatedResidente || null };
  
        // Actualizar el estado con la vivienda modificada
        setViviendas((prevViviendas) =>
          prevViviendas.map((vivienda) =>
            vivienda.ID === selectedHouse.ID ? updatedVivienda : vivienda
          )
        );
  
        setSelectedHouse(null);
        setIsEditing(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al modificar la vivienda:", error);
    }
  };
  

  return (
    <div className="gestionViviendas">
      {/* Título */}
      <h1 className="mainTitle">Gestión de Viviendas</h1>

      {/* Lista de viviendas */}
      <div className="housesSection">
        <div className="housesListContainer">
          <h2>Lista de Viviendas</h2>
          <ul className="housesList">
            {viviendas.map((vivienda) => (
              <li key={vivienda.ID}>
                {vivienda.numeracion} -{" "}
                {vivienda.ocupante
                  ? `${vivienda.ocupante.nombre} ${vivienda.ocupante.apellido}`
                  : "Residente no encontrado"}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Configuración de viviendas */}
      <div className="housesConfigSection">
        <h2>Configuración de Viviendas</h2>
        <div className="configButtons">
          <button
            className="addHouseButton"
            onClick={() => setIsAdding(true)}
          >
            Agregar Vivienda
          </button>
          <button
            className="editHouseButton"
            onClick={() => setIsEditing(true)}
          >
            Modificar Vivienda
          </button>
          <button
            className="deleteHouseButton"
            onClick={() => setIsDeleting(true)}
          >
            Borrar Vivienda
          </button>
        </div>

        {/* Formulario de agregar vivienda */}
        {isAdding && (
          <div className="houseDetailsForm">
            <h2>Agregar Vivienda</h2>
            <form>
              <div className="formGroup">
                <label>Num. Casa</label>
                <input
                  type="text"
                  name="numeracion"
                  placeholder="Ej: N22"
                  value={newHouse.numeracion}
                  onChange={handleInputChange}
                />
                {errors.numeracion && (
                  <p className="errorMessage">{errors.numeracion}</p>
                )}
              </div>
              <div className="formGroup">
                <label>Ocupante</label>
                <select
                  name="ocupanteID"
                  value={newHouse.ocupanteID}
                  onChange={handleInputChange}
                >
                  <option value="">Sin ocupante</option>
                  {residentes.map((residente) => (
                    <option key={residente.ID} value={residente.ID}>
                      {residente.nombre} {residente.apellido}
                    </option>
                  ))}
                </select>
                {errors.ocupanteID && (
                  <p className="errorMessage">{errors.ocupanteID}</p>
                )}
              </div>
              <div className="formButtons">
                <button
                  type="button"
                  className="acceptButton"
                  onClick={handleAddHouse}
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

        {/* Formulario de modificar vivienda */}
        {isEditing && (
          <div className="houseDetailsForm">
            <h2>Modificar Vivienda</h2>
            <form>
              <div className="formGroup">
                <label>Buscar Vivienda</label>
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Buscar por número de casa"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Sugerencias */}
                <ul className="suggestionsList">
                  {viviendas
                    .filter((vivienda) =>
                      vivienda.numeracion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((vivienda) => (
                      <li
                        key={vivienda.ID}
                        onClick={() => setSelectedHouse(vivienda)}
                        className="suggestionItem"
                      >
                        {vivienda.numeracion}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedHouse && (
                <>
                  <div className="formGroup">
                    <label>Num. Casa</label>
                    <input
                      type="text"
                      name="numeracion"
                      value={selectedHouse.numeracion}
                      onChange={(e) =>
                        setSelectedHouse({
                          ...selectedHouse,
                          numeracion: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="formGroup">
                    <label>Ocupante</label>
                    <select
                      name="ocupanteID"
                      value={selectedHouse.ocupanteID || ""}
                      onChange={(e) =>
                        setSelectedHouse({
                          ...selectedHouse,
                          ocupanteID: e.target.value,
                        })
                      }
                    >
                      <option value="">Sin ocupante</option>
                      {residentes.map((residente) => (
                        <option key={residente.ID} value={residente.ID}>
                          {residente.nombre} {residente.apellido}
                        </option>
                      ))}
                    </select>
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

        {/* Formulario de borrar vivienda */}
        {isDeleting && (
          <div className="houseDetailsForm">
            <h2>Borrar Vivienda</h2>
            <form>
              <div className="formGroup">
                <label>Buscar Vivienda</label>
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Buscar por número de casa"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Sugerencias */}
                <ul className="suggestionsList">
                  {viviendas
                    .filter((vivienda) =>
                      vivienda.numeracion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((vivienda) => (
                      <li
                        key={vivienda.ID}
                        onClick={() => setSelectedHouse(vivienda)}
                        className="suggestionItem"
                      >
                        {vivienda.numeracion}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedHouse && (
                <div className="selectedHouseInfo">
                  <p>
                    <strong>Num. Casa:</strong> {selectedHouse.numeracion}
                  </p>
                  <p>
                    <strong>Ocupante:</strong>{" "}
                    {selectedHouse.ocupante
                      ? `${selectedHouse.ocupante.nombre} ${selectedHouse.ocupante.apellido}`
                      : "Residente no encontrado"}
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
                  onClick={handleCancel}
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

export default GestionDeViviendas;
