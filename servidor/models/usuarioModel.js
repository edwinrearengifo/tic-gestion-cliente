class Usuario {
    constructor(ID, nombre, apellido, nombreUsuario, email, contraseña, teléfono, role) {
      this.ID = ID;
      this.nombre = nombre;
      this.apellido = apellido;
      this.nombreUsuario = nombreUsuario;
      this.email = email;
      this.contraseña = contraseña;
      this.teléfono = teléfono;
      this.role = role; // Puede ser "Residente" o "Administrador"
    }
  }
  
  module.exports = Usuario;
  