import React, { useState } from "react";
import "./styles/Home.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logoApp from "../img/logoApp.png";
import fondoHeader from "../img/fondoHeader.png";
import fondoFooter from "../img/fondoFooter.png";

import adminIcono from "../img/adminIcono.png";
import residenteIcono from "../img/residenteIcono.png";
import PageSwitcher from "../components/PageSwitcher";
import { useNavigate } from "react-router-dom";

// Fuente utilizada
import "@fontsource/dm-sans";

const Home = () => {
  const navigate = useNavigate(); // Hook para redirección

  const currentDate = format(new Date(), "EEEE dd 'de' MMMM 'de' yyyy", { locale: es });

  const [selectedRole, setSelectedRole] = useState("Administrador"); // Estado inicial

  // Función para manejar el cambio en el selector
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const endpoint =
      selectedRole === "Administrador"
        ? "http://localhost:5000/api/admins/login"
        : "http://localhost:5000/api/residentes/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bienvenido, ${data.role} (${data.username})`);

        if (data.role === "Residente") {
          navigate("/residente", { state: data }); // Pasar datos del residente al estado
        } else {
          navigate("/administrador", { state: data }); // Pasar datos del administrador al estado
        }
      } else {
        alert(data.error || "Credenciales inválidas. Intenta nuevamente.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="homeApp">
      {/* Encabezado */}
      <header className="headerApp" style={{ backgroundImage: `url(${fondoHeader})` }}>
        <div className="logoApp">
          <img src={logoApp} alt="logoApp" />
        </div>
        <div className="systemTitleApp">
          <h2>SISTEMA DE GESTIÓN DE ALÍCUOTAS</h2>
          <p>{currentDate}</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mainContentApp">
        <div className="loginFormApp">
          {/* Div para el título */}
          <div className="loginFormHeader">
            <h3>Inicio de Sesión</h3>
          </div>

          {/* Div medio para inputs e imagen */}
          <div className="loginFormBody">
            {/* Inputs y selector a la izquierda */}
            <div className="formInputs">
              <form onSubmit={handleLogin}>
                <select onChange={handleRoleChange} value={selectedRole}>
                  <option value="Administrador">Administrador</option>
                  <option value="Residente">Residente</option>
                </select>
                <input type="text" name="username" placeholder="Usuario" required />
                <input type="password" name="password" placeholder="Contraseña" required />
                {/* Div para el botón */}
                <div className="loginFormFooter">
                  <button type="submit">Ingresar al Sistema</button>
                </div>
              </form>
            </div>

            {/* Imagen a la derecha */}
            <div className="formImage">
              <img
                src={selectedRole === "Administrador" ? adminIcono : residenteIcono}
                alt={selectedRole}
              />
            </div>
          </div>
        </div>

        {/* Sección de administración */}
        <div className="adminSectionApp">
          <h2>Administración de servicios en alícuotas</h2>
          <PageSwitcher />
        </div>
      </main>

      {/* Pie de página */}
      <footer className="footerApp">
        <img src={fondoFooter} alt="fondoFooter" />
      </footer>
    </div>
  );
};

export default Home;
