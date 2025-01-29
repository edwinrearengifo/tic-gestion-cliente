import React, { useState, useEffect } from "react";
import "../views/styles/GestionDeResidentes.css";

const GestionDeResidentes = () => {
  const [residentes, setResidentes] = useState([]); // Lista de residentes
  const [isAdding, setIsAdding] = useState(false); // Controla si se está agregando un residente
  const [isEditing, setIsEditing] = useState(false); // Controla si se está editando un residente
  const [isDeleting, setIsDeleting] = useState(false); // Controla si se está eliminando un residente
  const [newResidente, setNewResidente] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    email: "",
    contraseña: "",
    teléfono: "",
    tipo: "Propietario",
  });

  const [selectedResidente, setSelectedResidente] = useState(null); // Residente seleccionado para editar/eliminar
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para autocompletar

  // Cargar la lista de residentes desde la API
  const fetchResidentes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/residentes");
      const data = await response.json();
      setResidentes(data);
    } catch (error) {
      console.error("Error al cargar residentes:", error);
    }
  };

  useEffect(() => {
    fetchResidentes();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedResidente({ ...selectedResidente, [name]: value });
    } else {
      setNewResidente({ ...newResidente, [name]: value });
    }
  };

  // Agregar un nuevo residente
  const handleAddResidente = async () => {
    const { nombre, apellido, nombreUsuario, email, contraseña, teléfono } = newResidente;
  
    if (!nombre || !apellido || !nombreUsuario || !email || !contraseña || !teléfono) {
      alert("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/residentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResidente),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setResidentes((prevResidentes) => [...prevResidentes, data]); // Agrega el nuevo residente
        setNewResidente({
          nombre: "",
          apellido: "",
          nombreUsuario: "",
          email: "",
          contraseña: "",
          teléfono: "",
          tipo: "Propietario",
        });
        setIsAdding(false);
        alert("Residente agregado con éxito.");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al agregar residente:", error);
    }
  };
  

  // Guardar cambios de un residente
  const handleSaveChanges = async () => {
    if (!selectedResidente.nombre || !selectedResidente.apellido || !selectedResidente.email) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/residentes/${selectedResidente.ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedResidente),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setResidentes((prevResidentes) =>
          prevResidentes.map((res) =>
            res.ID === selectedResidente.ID ? data : res
          )
        ); // Actualiza la lista
        setIsEditing(false);
        setSelectedResidente(null);
        alert("Residente modificado con éxito.");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al modificar residente:", error);
    }
  };
  

  // Eliminar un residente
  const handleDeleteResidente = async () => {
    if (!selectedResidente) {
      alert("Por favor, selecciona un residente para eliminar.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/residentes/${selectedResidente.ID}`,
        { method: "DELETE" }
      );
  
      if (response.ok) {
        setResidentes((prevResidentes) =>
          prevResidentes.filter((res) => res.ID !== selectedResidente.ID)
        ); // Elimina el residente de la lista
        setIsDeleting(false);
        setSelectedResidente(null);
        alert("Residente eliminado con éxito.");
      } else {
        alert("Error al eliminar residente.");
      }
    } catch (error) {
      console.error("Error al eliminar residente:", error);
    }
  };
  

  // Cancelar las operaciones (Agregar, Editar, Eliminar)
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsDeleting(false);
    setSelectedResidente(null);
    setSearchTerm("");
  };

  return (
    <div className="gestionResidentes">
      <h1 className="mainTitle">Gestión de Residentes</h1>

      {/* Tabla de residentes */}
      <div className="residentsSection">
        <h2>Residentes Actuales</h2>
        <table className="residentsTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {residentes &&
              residentes.map((residente) =>
                residente && residente.nombre ? (
                  <tr key={residente.ID}>
                    <td>{residente.nombre}</td>
                    <td>{residente.apellido}</td>
                    <td>{residente.nombreUsuario}</td>
                    <td>{residente.email}</td>
                    <td>{residente.teléfono}</td>
                    <td>{residente.tipo}</td>
                  </tr>
                ) : null
              )}
          </tbody>

        </table>
      </div>

      {/* Configuración de residentes */}
      <div className="residentsConfigSection">
        <h2>Configuración de Residentes</h2>
        <div className="configButtons">
          <button className="addResidentButton" onClick={() => setIsAdding(true)}>
            Agregar Residente
          </button>
          <button className="editResidentButton" onClick={() => setIsEditing(true)}>
            Modificar Residente
          </button>
          <button className="deleteResidentButton" onClick={() => setIsDeleting(true)}>
            Borrar Residente
          </button>
        </div>

        {/* Formularios de agregar residente */}
        {isAdding && (
          <div className="residentDetailsForm">
            <h2>Agregar Residente</h2>
            <form>
              <div className="formGroup">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={newResidente.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={newResidente.apellido}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Nombre de Usuario</label>
                <input
                  type="text"
                  name="nombreUsuario"
                  placeholder="Nombre de usuario"
                  value={newResidente.nombreUsuario}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={newResidente.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={newResidente.contraseña}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="teléfono"
                  placeholder="Teléfono"
                  value={newResidente.teléfono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formGroup">
                <label>Tipo</label>
                <select
                  name="tipo"
                  value={newResidente.tipo}
                  onChange={handleInputChange}
                >
                  <option>Propietario</option>
                  <option>Arrendatario</option>
                </select>
              </div>
              <div className="formButtons">
                <button type="button" className="acceptButton" onClick={handleAddResidente}>
                  Aceptar
                </button>
                <button type="button" className="cancelButton" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario de modificar residente */}
        {isEditing && (
          <div className="residentDetailsForm">
            <h2>Modificar Residente</h2>
            <input
              type="text"
              placeholder="Buscar residente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {residentes
                .filter((res) =>
                  res.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((res) => (
                  <li
                    key={res.ID}
                    onClick={() => {
                      setSelectedResidente(res);
                      setSearchTerm("");
                    }}
                  >
                    {res.nombre} - {res.email}
                  </li>
                ))}
            </ul>
            {selectedResidente && (
              <>
                <form>
                  <div className="formGroup">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={selectedResidente.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={selectedResidente.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Nombre de Usuario</label>
                    <input
                      type="text"
                      name="nombreUsuario"
                      value={selectedResidente.nombreUsuario}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedResidente.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      name="contraseña"
                      value={selectedResidente.contraseña || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="teléfono"
                      value={selectedResidente.teléfono}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Tipo</label>
                    <select
                      name="tipo"
                      value={selectedResidente.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="Propietario">Propietario</option>
                      <option value="Arrendatario">Arrendatario</option>
                    </select>
                  </div>
                  <div className="formButtons">
                    <button type="button" className="acceptButton" onClick={handleSaveChanges}>
                      Guardar Cambios
                    </button>
                    <button type="button" className="cancelButton" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        {/* Formulario de eliminar residente */}
        {isDeleting && (
          <div className="residentDetailsForm">
            <h2>Eliminar Residente</h2>
            <input
              type="text"
              placeholder="Buscar residente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {residentes
                .filter((res) =>
                  res.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((res) => (
                  <li key={res.ID} onClick={() => setSelectedResidente(res)}>
                    {res.nombre} - {res.email}
                  </li>
                ))}
            </ul>
            {selectedResidente && (
              <>
                <p>
                  <strong>¿Deseas eliminar a este residente?</strong>
                  <br />
                  {selectedResidente.nombre} - {selectedResidente.email}
                </p>
                <div className="formButtons">
                  <button type="button" className="acceptButton" onClick={handleDeleteResidente}>
                    Confirmar
                  </button>
                  <button type="button" className="cancelButton" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

};

export default GestionDeResidentes;
