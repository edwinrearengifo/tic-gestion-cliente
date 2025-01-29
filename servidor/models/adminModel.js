const Usuario = require("./usuarioModel");

class Administrador extends Usuario {
  constructor(ID, nombre, apellido, nombreUsuario, email, contraseña, teléfono) {
    super(ID, nombre, apellido, nombreUsuario, email, contraseña, teléfono, "Administrador");
  }
}

// Stub de datos para administradores
const admins = [
  // DATOS PARA ADMINISTRADOR POR DEFAULT
  new Administrador("1", "admin", "admin", "admin", "admin.admin@mail.com", "admin", "0991234567"),
  // Administradores creados
  new Administrador("2", "Carlos", "Gómez", "admin1", "carlos.gomez@mail.com", "admin123", "123456789"),
  new Administrador("3", "María", "Torres", "admin2", "maria.torres@mail.com", "admin456", "987654321"),
];

// Función para buscar un administrador
const findAdmin = (username, password) => {
  return admins.find(
    (admin) => admin.nombreUsuario === username && admin.contraseña === password
  );
};

module.exports = { Administrador, admins, findAdmin };
