const express = require("express");
const router = express.Router();
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

router.get("/province",async (req, res) => {
  try {
    const [results, data] = await sequelize.query(`select * from tbprovince`);
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


router.get("/district", async (req, res) => {
  try {
    const [results, data] = await sequelize.query(`select * from tbdistrict`);
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

router.get("/subdistrict", async (req, res) => {
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


router.get("/province/ById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbprovince where provinceId = '${id}'`);
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


router.get("/district/ById/:id", async (req, res) => {
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

router.get("/subdistrict/ById/:id", async (req, res) => {
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


router.get("/district/byIdProvince/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [results, data] = await sequelize.query(`select * from tbdistrict where provinceId = '${id}' `);
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

router.get("/subdistrict/byIdDistrict/:id", async (req, res) => {
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

router.get("/subdistrict/byIdSubdistrict/:id", async (req, res) => {
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
