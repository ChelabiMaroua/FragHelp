const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const databaseRoutes = require("./routes/database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/database", databaseRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
});
