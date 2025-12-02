const oracledb = require("oracledb");

oracledb.autoCommit = true; // pour que les requêtes soient validées automatiquement

const connectToOracle = async (connectionInfo) => {
  try {
    const connection = await oracledb.getConnection({
      user: connectionInfo.username,
      password: connectionInfo.password,
      connectString: `${connectionInfo.host}:${connectionInfo.port}/${connectionInfo.database}`
    });
    console.log("✅ Connecté à Oracle :", connectionInfo.database);
    return connection;
  } catch (err) {
    console.error("❌ Erreur de connexion Oracle :", err);
    throw err;
  }
};

module.exports = { connectToOracle };
