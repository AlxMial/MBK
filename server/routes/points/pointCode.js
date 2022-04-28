const express = require("express");
const router = express.Router();
const { tbPointCodeHD } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", async (req, res) => {
  const postCodeHD = await tbPointCodeHD.findOne({
    where: {
      pointCodeName: req.body.pointCodeName,
      isDeleted: false,
    },
  });
  if (!postCodeHD) {
    const postCode = await tbPointCodeHD.create(req.body);
    res.json({
      status: true,
      isPointCodeName: false,
      message: "success",
      tbPointCodeHD: postCode,
    });
  } else {
    res.json({
      status: false,
      isPointCodeName: true,
      message: "success",
      tbPointCodeHD: null,
    });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointCodeHD = await tbPointCodeHD.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: listPointCodeHD,
  });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const listPointCodeHD = await tbPointCodeHD.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: listPointCodeHD,
  });
});

router.put("/", async (req, res) => {
  const postCodeHD = await tbPointCodeHD.findOne({
    where: {
      pointCodeName: req.body.pointCodeName,
      isDeleted: false,
      id: {
        [Op.ne] : req.body.id,
      }
    },
  });

  if (!postCodeHD) {
    const listPointCodeHD = await tbPointCodeHD.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({
      status: true,
      message: "success",
      tbPointCodeHD: listPointCodeHD,
    });
  } else {
    res.json({
      status: false,
      isPointCodeName: true,
      message: "success",
      tbPointCodeHD: null,
    });
  }
});

router.delete("/:postCodeId", async (req, res) => {
  const postCodeId = req.params.postCodeId;
  req.body.isDeleted = true;
  tbPointCodeHD.update(req.body, { where: { id: postCodeId } });
  res.json({ status: true, message: "success", tbPointCodeHD: null });
});

module.exports = router;
