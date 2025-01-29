import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/ResidenteHome.css";
import AlicuotasResidente from "../components/AlicuotasResidente";
import MiPerfil from "../components/ResidenteMiPerfil";
import residenteIcono from "../img/residenteIcono.png";

const ResidenteHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [residenteData, setResidenteData] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // Estado para el mensaje de confirmación
  const [activeSection, setActiveSection] = useState("Estado de Alícuota");

  useEffect(() => {
    if (location.state) {
      const usuarioData = location.state.usuario || {};
      setResidenteData(usuarioData);
    } else {
      navigate("/"); // Redirigir al inicio si no hay datos
    }
  }, [location.state, navigate]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true); // Mostrar el mensaje de confirmación
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redirigir al inicio de sesión
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false); // Ocultar el mensaje de confirmación
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Estado de Alícuota":
        return <AlicuotasResidente residente={residenteData} />; // Pasamos residenteData como prop
      case "Mi Perfil":
        return <MiPerfil residenteData={residenteData} />;
      default:
        return <h1>Sección no encontrada</h1>;
    }
  };
  

  return (
    <div className="residenteHome">
      <aside className="sidebar">
        <div className="profileSection">
          {residenteData && (
            <>
              <img
                src={residenteIcono}
                alt="Foto de perfil"
                className="profileImage"
              />
              <h3 className="username">{`${residenteData.nombre || "Nombre no definido"} ${
                residenteData.apellido || "Apellido no definido"
              }`}</h3>
              <p>{`Rol: Residente`}</p>
            </>
          )}
        </div>
        <div className="menuOptions">
          <button
            className={`menuButton ${activeSection === "Estado de Alícuota" ? "active" : ""}`}
            onClick={() => handleSectionChange("Estado de Alícuota")}
          >
            Gestión de Alícuotas
          </button>
          <button
            className={`menuButton ${activeSection === "Mi Perfil" ? "active" : ""}`}
            onClick={() => handleSectionChange("Mi Perfil")}
          >
            Mi Perfil
          </button>
          <button className="menuButton logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
          {/* Mensaje de confirmación */}
          {showLogoutConfirmation && (
            <div className="logoutConfirmation">
              <p>¿Estás seguro de cerrar sesión?</p>
              <button className="confirmButton" onClick={confirmLogout}>
                Sí
              </button>
              <button className="cancelButton" onClick={cancelLogout}>
                No
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="mainContent">{renderContent()}</main>
    </div>
  );
};

export default ResidenteHome;
