const express = require("express");
const cors = require("cors");
const routes = require("./routes/adminRoutes");

const app = express();
const PORT = 5000;

app.use(cors()); // Habilita CORS
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
