const express = require("express");
const router = express.Router();
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const config = require("../../services/config.line");
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

router.get("/province", validateToken, async (req, res) => {
  try {
    const [results, data] = await sequelize.query(`select * from tbprovince`);
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
  try {
    const [results, data] = await sequelize.query(`select * from tbdistrict`);
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

router.get("/subdistrict", validateToken, async (req, res) => {
  try {
    const [results, data] = await sequelize.query(`select * from tbsubdistricts`);
    res.json({
      status: true,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});


router.get("/province/ById/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbprovince where provinceId = '${id}'`);
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


router.get("/district/ById/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbdistrict where districtId = '${id}'`);
    res.json({
      status: true,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});

router.get("/subdistrict/ById/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbsubdistricts where subdistrictId = '${id}'`);
    res.json({
      status: true,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});


router.get("/district/byIdProvince/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbdistrict where provinceId = '${id}' `);
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

router.get("/subdistrict/byIdDistrict/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbsubdistricts where districtId = '${id}'`);
    res.json({
      status: true,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});

router.get("/subdistrict/byIdSubdistrict/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select postCode from tbsubdistricts where subDistrictId = '${id}'`);
    res.json({
      status: true,
      address: data,
    });
  } catch {
    res.json({
      status: false,
      address: null,
    });
  }
});


module.exports = router;
