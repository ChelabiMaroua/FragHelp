const express = require("express");
const router = express.Router();
const { connectToOracle } = require("../config/Oracle");

// Stockage temporaire des connexions
const connections = {};

// Tester la connexion
router.post("/test", async (req, res) => {
  const connInfo = req.body;
  try {
    const connection = await connectToOracle(connInfo);
    await connection.close();
    res.json({ success: true, message: "Connexion Oracle réussie !" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Établir la connexion et créer une clé temporaire
router.post("/connect", async (req, res) => {
  const connInfo = req.body;
  const key = Date.now().toString();
  try {
    const connection = await connectToOracle(connInfo);
    connections[key] = connection;
    res.json({ success: true, key });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const oracledb = require("oracledb");

// Récupérer les tables avec colonnes et stats
router.get("/:key/tables", async (req, res) => {
  const { key } = req.params;
  const connection = connections[key];
  if (!connection) return res.status(400).json({ error: "Connexion invalide" });

  try {
    // Récupérer toutes les tables
    const tablesResult = await connection.execute(
      `SELECT table_name FROM user_tables`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const tables = [];
    let totalAttributes = 0;

    for (const row of tablesResult.rows) {
      const tableName = row.TABLE_NAME;

      // Récupérer les colonnes pour chaque table
      const columnsResult = await connection.execute(
        `SELECT column_name, data_type FROM user_tab_columns WHERE table_name = :tableName`,
        [tableName],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const columns = columnsResult.rows.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE
      }));
      totalAttributes += columns.length;

      tables.push({
        name: tableName,
        columns,
        numAttributes: columns.length
      });
    }

    res.json({
      tables,
      totalTables: tables.length,
      totalAttributes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 NOUVEAU : Récupérer le nombre de lignes d'une table
router.get("/:key/tables/:table/rowcount", async (req, res) => {
  const { key, table } = req.params;
  const connection = connections[key];
  if (!connection) return res.status(400).json({ error: "Connexion invalide" });

  try {
    const result = await connection.execute(
      `SELECT COUNT(*) as count FROM ${table}`
    );
    
    res.json({ rowCount: result.rows[0][0] });
  } catch (err) {
    console.error("Erreur rowcount:", err);
    res.status(500).json({ error: err.message });
  }
});

// Récupérer la structure d'une table
router.get("/:key/tables/:table/structure", async (req, res) => {
  const { key, table } = req.params;
  const connection = connections[key];
  if (!connection) return res.status(400).json({ error: "Connexion invalide" });

  try {
    const result = await connection.execute(
      `SELECT column_name, data_type, nullable 
       FROM user_tab_columns 
       WHERE table_name = :table`,
      [table.toUpperCase()],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const columns = result.rows.map(row => ({
      name: row.COLUMN_NAME,
      type: row.DATA_TYPE,
      nullable: row.NULLABLE === 'Y'
    }));

    const rowCountRes = await connection.execute(
      `SELECT COUNT(*) FROM ${table}`
    );

    res.json({
      columns,
      rowCount: rowCountRes.rows[0][0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un échantillon de données
router.get("/:key/tables/:table/sample", async (req, res) => {
  const { key, table } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  const connection = connections[key];
  if (!connection) return res.status(400).json({ error: "Connexion invalide" });

  try {
    const result = await connection.execute(
      `SELECT * FROM ${table} WHERE ROWNUM <= :limit`,
      [limit],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analyser une colonne pour la fragmentation
router.get("/:key/tables/:table/columns/:column/analyze", async (req, res) => {
  const { key, table, column } = req.params;
  const connection = connections[key];
  if (!connection) return res.status(400).json({ error: "Connexion invalide" });

  try {
    // Nombre de valeurs distinctes
    const distinctCountResult = await connection.execute(
      `SELECT COUNT(DISTINCT ${column}) AS count FROM ${table}`
    );

    const distinctCount = distinctCountResult.rows[0][0];

    // Les valeurs distinctes les plus fréquentes (limit à 10)
    const topValuesResult = await connection.execute(
      `SELECT ${column}, COUNT(*) AS freq 
       FROM ${table} 
       GROUP BY ${column} 
       ORDER BY freq DESC 
       FETCH FIRST 10 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      distinctCount,
      topValues: topValuesResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fermer la connexion
router.delete("/:key", async (req, res) => {
  const { key } = req.params;
  const connection = connections[key];
  if (connection) {
    await connection.close();
    delete connections[key];
  }
  res.json({ success: true });
});

module.exports = router;