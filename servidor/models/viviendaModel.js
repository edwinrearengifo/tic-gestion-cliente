class Vivienda {
    constructor(ID, numeracion, ocupanteID = null, historialOcupantes = []) {
      this.ID = ID; // ID único y secuencial
      this.numeracion = numeracion; // Número de casa
      this.ocupanteID = ocupanteID; // ID del residente actual (opcional)
      this.historialOcupantes = historialOcupantes; // Array de IDs de ocupantes anteriores
    }
  
    // Método para cambiar el ocupante actual
    cambiarOcupante(nuevoOcupanteID) {
      if (this.ocupanteID) {
        // Agregar el ocupante actual al historial antes de cambiarlo
        this.historialOcupantes.push(this.ocupanteID);
      }
      this.ocupanteID = nuevoOcupanteID; // Actualizar el ocupante actual
    }
  }
  
  // Datos simulados para viviendas
  const viviendas = [
    new Vivienda(1, "Casa 1", "1", []), // Juan Pérez es el actual ocupante
    new Vivienda(2, "Depto A-2", "2", []), // Ana López es la actual ocupante
    new Vivienda(3, "Casa 2", "3", []), // Carlos Ramírez es el actual ocupante
    new Vivienda(4, "Casa 3", null, ["123", "456"]), // Sin ocupante actual, con historial
    new Vivienda(5, "Depto B-4", null, []), // Sin ocupante actual ni historial
  ];
  
  // Método para agregar una vivienda
  const addVivienda = (numeracion, ocupanteID = null) => {
    const nuevaVivienda = new Vivienda(
      viviendas.length ? Math.max(...viviendas.map((v) => v.ID)) + 1 : 1,
      numeracion,
      ocupanteID
    );
    viviendas.push(nuevaVivienda);
    return nuevaVivienda;
  };
  
  // Método para actualizar una vivienda
  const updateVivienda = (ID, numeracion, nuevoOcupanteID) => {
    const vivienda = viviendas.find((v) => v.ID === ID);
    if (!vivienda) throw new Error("Vivienda no encontrada.");
  
    if (numeracion) vivienda.numeracion = numeracion;
  
    if (nuevoOcupanteID && nuevoOcupanteID !== vivienda.ocupanteID) {
      vivienda.cambiarOcupante(nuevoOcupanteID);
    }
  
    return vivienda;
  };
  
  // Método para eliminar una vivienda
  const deleteVivienda = (ID) => {
    const index = viviendas.findIndex((v) => v.ID === ID);
    if (index === -1) throw new Error("Vivienda no encontrada.");
    const [eliminada] = viviendas.splice(index, 1);
    return eliminada;
  };
  
  // Método para listar todas las viviendas
  const getAllViviendas = () => viviendas;
  
  // Exportar el modelo y los métodos
  module.exports = {
    Vivienda,
    viviendas,
    addVivienda,
    updateVivienda,
    deleteVivienda,
    getAllViviendas,
  };
  