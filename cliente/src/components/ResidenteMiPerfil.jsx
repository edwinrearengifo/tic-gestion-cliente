import React from "react";
import "../views/styles/ResidenteMiPerfil.css";

const ResidenteMiPerfil = ({ residenteData }) => {
  if (!residenteData) {
    return <h2>No se encontraron datos del perfil.</h2>;
  }
  console.log("Datos de residente:", residenteData);


  return (
    <div className="perfilContainer">
      <h1>Detalles de Perfil</h1>
      <table className="perfilTable">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{residenteData.ID || "ID no definido"}</td>
          </tr>
          <tr>
            <th>Nombre</th>
            <td>{`${residenteData.nombre || "Nombre no definido"} ${
              residenteData.apellido || "Apellido no definido"
            }`}</td>
          </tr>
          <tr>
            <th>Nombre de Usuario</th>
            <td>{residenteData.nombreUsuario || "Usuario no definido"}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{residenteData.email || "Email no definido"}</td>
          </tr>
          <tr>
            <th>Teléfono</th>
            <td>{residenteData.teléfono || "Teléfono no definido"}</td>
          </tr>
          <tr>
            <th>Tipo</th>
            <td>{residenteData.tipo || "Tipo no definido"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResidenteMiPerfil;
