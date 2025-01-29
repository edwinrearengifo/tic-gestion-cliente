import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AdministradorHome.css";
import MiPerfil from "../components/AdminMiPerfil";
import MonitoreoDeAlicuotas from "../components/MonitoreoDeAlicuotas";
import GestionDeAlicuotas from "../components/GestionDeAlicuotas.jsx";
import GestionDeServicios from "../components/GestionDeServicios";
import GestionDeResidentes from "../components/GestionDeResidentes";
import GestionDeViviendas from "../components/GestionDeViviendas";
import adminIcono from "../img/adminIcono.png";

const AdministradorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // Estado para el mensaje de confirmación

  // Estado para el valor de la alícuota
  const [valorAlicuota, setValorAlicuota] = useState(0);

  useEffect(() => {
    if (location.state) {
      const usuarioData = location.state.usuario || {};
      const fullAdminData = {
        ...usuarioData,
        role: location.state.role, // Agregar el rol al objeto adminData
      };
      setAdminData(fullAdminData);
    } else {
      navigate("/"); // Redirigir al inicio si no hay datos
    }
  }, [location.state, navigate]);

  const [activeSection, setActiveSection] = useState("Monitoreo de Alícuotas");

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
      case "Monitoreo de Alícuotas":
        return <MonitoreoDeAlicuotas />;
        case "Gestión de Servicios":
          return <GestionDeServicios setValorAlicuota={setValorAlicuota} />; // Pasar la función al componente
        case "Gestión de Alícuotas":
          return <GestionDeAlicuotas valorAlicuota={valorAlicuota} />; // Pasar el valor al componente
      case "Gestión de Residentes":
        return <GestionDeResidentes />;
      case "Gestión de Viviendas":
        return <GestionDeViviendas />;
      case "Mi Perfil":
        return <MiPerfil adminData={adminData} />;
      default:
        return <h1>Sección no encontrada</h1>;
    }
  };

  return (
    <div className="adminHome">
      <aside className="sidebar">
        <div className="profileSection">
          {adminData && (
            <>
              <img
                src={adminIcono}
                alt="Admin Avatar"
                className="profileImage"
              />
              <h3 className="username">{`${adminData.nombre || "Nombre no definido"} ${
                adminData.apellido || "Apellido no definido"
              }`}</h3>
              <p>{`Rol: ${adminData.role || "Rol no definido"}`}</p>
            </>
          )}
        </div>
        <div className="menuOptions">
          <button
            className={`menuButton ${activeSection === "Monitoreo de Alícuotas" ? "active" : ""}`}
            onClick={() => handleSectionChange("Monitoreo de Alícuotas")}
          >
            Monitoreo de Alícuotas
          </button>
          <button
            className={`menuButton ${activeSection === "Gestión de Alícuotas" ? "active" : ""}`}
            onClick={() => handleSectionChange("Gestión de Alícuotas")}
          >
            Gestión de Alícuotas
          </button>
          <button
            className={`menuButton ${activeSection === "Gestión de Servicios" ? "active" : ""}`}
            onClick={() => handleSectionChange("Gestión de Servicios")}
          >
            Gestión de Servicios
          </button>
          <button
            className={`menuButton ${activeSection === "Gestión de Residentes" ? "active" : ""}`}
            onClick={() => handleSectionChange("Gestión de Residentes")}
          >
            Gestión de Residentes
          </button>
          <button
            className={`menuButton ${activeSection === "Gestión de Viviendas" ? "active" : ""}`}
            onClick={() => handleSectionChange("Gestión de Viviendas")}
          >
            Gestión de Viviendas
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

export default AdministradorHome;
