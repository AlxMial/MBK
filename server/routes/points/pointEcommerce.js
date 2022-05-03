const express = require("express");
const router = express.Router();
const { tbPointEcommerceHD } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/",validateToken, async (req, res) => {
  const pointEcommerceHD = await tbPointEcommerceHD.findOne({
    where: {
      pointEcommerceName: req.body.pointEcommerceName,
      isDeleted: false,
    },
  });
  if (!pointEcommerceHD) {
    const postCode = await tbPointEcommerceHD.create(req.body);
    res.json({
      status: true,
      isPointEcommerceName: false,
      message: "success",
      tbPointEcommerceHD: postCode,
    });
  } else {
    res.json({
      status: false,
      isPointEcommerceName: true,
      message: "success",
      tbPointEcommerceHD: null,
    });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointEcommerce = await tbPointEcommerceHD.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointEcommerceHD: listPointEcommerce,
  });
});

router.get("/byId/:id",validateToken, async (req, res) => {
  const id = req.params.id;
  const listPointEcommerce = await tbPointEcommerceHD.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPointEcommerceHD: listPointEcommerce,
  });
});

router.put("/",validateToken, async (req, res) => {
  const pointEcommerceHD = await tbPointEcommerceHD.findOne({
    where: {
      pointEcommerceName: req.body.pointEcommerceName,
      isDeleted: false,
      id: {
        [Op.ne] : req.body.id,
      }
    },
  });

  if (!pointEcommerceHD) {
    const listPointEcommerce = await tbPointEcommerceHD.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({
      status: true,
      message: "success",
      tbPointEcommerceHD: listPointEcommerce,
    });
  } else {
    res.json({
      status: false,
      isPointEcommerceName: true,
      message: "success",
      tbPointEcommerceHD: null,
    });
  }
});

router.delete("/:pointEcommerceId",validateToken, async (req, res) => {
  const pointEcommerceId = req.params.pointEcommerceId;
  req.body.isDeleted = true;
  tbPointEcommerceHD.update(req.body, { where: { id: pointEcommerceId } });
  res.json({ status: true, message: "success", tbPointEcommerceHD: null });
});

module.exports = router;
