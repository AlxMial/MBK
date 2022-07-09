const express = require("express");
const moment = require("moment");
const router = express.Router();
const ValidateEncrypt = require("../../../services/crypto");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const Encrypt = new ValidateEncrypt();
const config = require("../../../services/config.line");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);

router.get("/provice", validateToken, async (req, res) => {
  try {
    const [results, data] = await sequelize.query(`select * from tbprovice`);
    res.json({
      status: results,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});

router.get("/district", validateToken, async (req, res) => {
  const [results, data] = await sequelize.query(`select * from tbdistrict`);
});

router.get("/subdistrict", validateToken, async (req, res) => {
  const [results, data] = await sequelize.query(`select * from tbsubdistrict`);
});

module.exports = router;
