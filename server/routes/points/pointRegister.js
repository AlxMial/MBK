const express = require("express");
const router = express.Router();
const { tbPointRegister } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
  const pointRegister = await tbPointRegister.create(req.body);
  Encrypt.encryptValueId(pointRegister);
  res.json({
    status: true,
    message: "success",
    tbPointRegister: pointRegister,
  });
});

router.get("/", validateToken, async (req, res) => {
  const listPointRegister = await tbPointRegister.findAll({
    where: { isDeleted: false },
  });
  Encrypt.encryptValueIdArray(listPointRegister);
  res.json({
    status: true,
    message: "success",
    tbPointRegister: listPointRegister,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = Encrypt.DecodeKey(req.params.id);
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
  req.body.id = Encrypt.DecodeKey(req.body.id);
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
  const pointRegisterId = Encrypt.DecodeKey(req.params.pointRegisterId);
  req.body.isDeleted = true;
  tbPointRegister.update(req.body, { where: { id: pointRegisterId } });
  res.json({ status: true, message: "success", tbPointRegister: null });
});

module.exports = router;
