import React from "react";
import "../views/styles/AdminMiPerfil.css";

const MiPerfil = ({ adminData }) => {
  if (!adminData) {
    return <h2>No se encontraron datos del perfil.</h2>;
  }

  return (
    <div className="perfilContainer">
      <h1>Detalles de Perfil</h1>
      <table className="perfilTable">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{adminData.ID || "ID no definido"}</td>
          </tr>
          <tr>
            <th>Nombre</th>
            <td>{`${adminData.nombre || "Nombre no definido"} ${
              adminData.apellido || "Apellido no definido"
            }`}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{adminData.email || "Email no definido"}</td>
          </tr>
          <tr>
            <th>Teléfono</th>
            <td>{adminData.teléfono || "Teléfono no definido"}</td>
          </tr>
          <tr>
            <th>Rol</th>
            <td>{adminData.role || "Rol no definido"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MiPerfil;
