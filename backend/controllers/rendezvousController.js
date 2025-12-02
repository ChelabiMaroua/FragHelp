const oracledb = require("oracledb");
const dbConfig = require("../config/dbConfig");

exports.getAllRendezvous = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT * FROM RendezVous");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  } finally {
    if (connection) await connection.close();
  }
};

exports.getRdvById = async (req, res) => { /* SELECT avec WHERE */ };
exports.addRdv = async (req, res) => { /* INSERT */ };
exports.updateRdv = async (req, res) => { /* UPDATE */ };
exports.deleteRdv = async (req, res) => { /* DELETE */ };
