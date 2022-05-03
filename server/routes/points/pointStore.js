const express = require("express");
const router = express.Router();
const { tbPointStore } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/",validateToken, async (req, res) => {
  const pointStoreHD = await tbPointStore.findOne({
    where: {
      pointStoreName: req.body.pointStoreName,
      isDeleted: false,
    },
  });
  if (!pointStoreHD) {
    const pointStore = await tbPointStore.create(req.body);
    res.json({
      status: true,
      isPointStoreName: false,
      message: "success",
      tbPointStore: pointStore,
    });
  } else {
    res.json({
      status: false,
      isPointStoreName: true,
      message: "success",
      tbPointStore: null,
    });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointStore = await tbPointStore.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointStore: listPointStore,
  });
});

router.get("/byId/:id",validateToken, async (req, res) => {
  const id = req.params.id;
  const listPointStore = await tbPointStore.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPointStore: listPointStore,
  });
});

router.put("/",validateToken, async (req, res) => {
  const pointStoreHD = await tbPointStore.findOne({
    where: {
      pointStoreName: req.body.pointStoreName,
      isDeleted: false,
      id: {
        [Op.ne] : req.body.id,
      }
    },
  });

  if (!pointStoreHD) {
    const listPointStore = await tbPointStore.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({
      status: true,
      message: "success",
      tbPointStore: listPointStore,
    });
  } else {
    res.json({
      status: false,
      isPointStoreName: true,
      message: "success",
      tbPointStore: null,
    });
  }
});

router.delete("/:pointStoreId",validateToken, async (req, res) => {
  const pointStoreId = req.params.pointStoreId;
  req.body.isDeleted = true;
  tbPointStore.update(req.body, { where: { id: pointStoreId } });
  res.json({ status: true, message: "success", tbPointStore: null });
});

module.exports = router;
