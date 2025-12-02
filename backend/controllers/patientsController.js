const oracledb = require("oracledb");
const dbConfig = require("../config/dbConfig");

// Exemple de fonction pour récupérer tous les patients
exports.getAllPatients = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT * FROM Patients");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  } finally {
    if (connection) await connection.close();
  }
};

exports.getPatientById = async (req, res) => { /* similaire à getAllPatients avec WHERE */ };
exports.addPatient = async (req, res) => { /* INSERT */ };
exports.updatePatient = async (req, res) => { /* UPDATE */ };
exports.deletePatient = async (req, res) => { /* DELETE */ };
