import React, { useState } from "react";
import "../views/styles/PageSwitcher.css";
import imageSwitcher1 from "../img/imageSwitcher1.png";
import imageSwitcher2 from "../img/imageSwitcher2.png";
import imageSwitcher3 from "../img/imageSwitcher3.png";
import imageSwitcher4 from "../img/imageSwitcher4.png";

// Páginas simuladas con imágenes, títulos y textos
const pages = [
  {
    image: imageSwitcher1,
    title: "Administración de servicios en alícuotas",
    text: "Desde el perfil de Administrador se puede configurar los servicios que se asocian a las alícuotas.",
  },
  {
    image: imageSwitcher2,
    title: "Gestión de pagos de alícuotas",
    text: "Los residentes pueden consultar y realizar los pagos de sus alícuotas desde la plataforma.",
  },
  {
    image: imageSwitcher3,
    title: "Configuración de usuarios",
    text: "El Administrador puede gestionar los usuarios del sistema, asociándolos a sus propiedades.",
  },
  {
    image: imageSwitcher4,
    title: "Historial de transacciones",
    text: "Consulta el historial de pagos y servicios asociados a cada alícuota en tiempo real.",
  },
];

const PageSwitcher = () => {
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual

  return (
    <div className="pageSwitcher">
      {/* Contenido de la página actual */}
      <div className="currentPage">
        <img src={pages[currentPage].image} alt={pages[currentPage].title} />
        <h3>{pages[currentPage].title}</h3>
        <p>{pages[currentPage].text}</p>
      </div>

      {/* Controles para cambiar entre páginas */}
      <div className="pageControls">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`rectangle ${currentPage === index ? "active" : ""}`}
            onClick={() => setCurrentPage(index)} // Cambia la página al hacer clic
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PageSwitcher;
