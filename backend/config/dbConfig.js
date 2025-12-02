const oracledb = require("oracledb");

const dbConfig = {
  user: "BDD_FRAG",
  password: "frag123",
  connectString: "localhost:1521/MyDB"
};

module.exports = dbConfig;
