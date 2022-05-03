const express = require("express");
const router = express.Router();
const { tbPointRegister } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
  const pointStore = await tbPointRegister.create(req.body);
  res.json({
    status: true,
    message: "success",
    tbPointRegister: pointStore,
  });
});

router.get("/", validateToken, async (req, res) => {
  const listPointRegister = await tbPointRegister.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointRegister: listPointRegister,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const listPointRegister = await tbPointRegister.findOne({
    where: { id: id },
  });
  res.json({
    status: true,
    message: "success",
    tbPointRegister: listPointRegister,
  });
});

router.put("/", validateToken, async (req, res) => {
  console.log(req.body.id )
  const listPointRegister = await tbPointRegister.update(req.body, {
    where: { id: req.body.id },
  });
  res.json({
    status: true,
    message: "success",
    tbPointRegister: listPointRegister,
  });
});

router.delete("/:pointRegisterId", validateToken, async (req, res) => {
  const pointRegisterId = req.params.pointRegisterId;
  req.body.isDeleted = true;
  tbPointRegister.update(req.body, { where: { id: pointRegisterId } });
  res.json({ status: true, message: "success", tbPointRegister: null });
});

module.exports = router;
