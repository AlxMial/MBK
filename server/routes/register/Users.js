const express = require("express");
const router = express.Router();
const { tbUser } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = await tbUser.findOne({ where: { userName: userName } });
  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        res.json({ error: "Wrong Username And Password Combination" });
      } else {
        const accessToken = sign(
          { userName: user.userName, id: user.id, role: user.role },
          "MBKPROJECT"
        );
        res.json({
          token: accessToken,
          userName: userName,
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.post("/", async (req, res) => {
  try {
    const user = await tbUser.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { userName: req.body.userName }],
        isDeleted: false,
      },
    });

    if (!user) {
      bcrypt.hash(req.body.password, 10).then(async (hash) => {
        req.body.password = hash;
        const listUser = await tbUser.create(req.body);
        res.json({ status: true, message: "success", tbUser: listUser });
      });
    } else {
      if (user.email === req.body.email)
        res.json({
          status: false,
          message: "Email ซ้ำกับในระบบกรุณากรอกข้อมูลใหม่",
          tbUser: null,
        });
      else if (user.userName === req.body.userName)
        res.json({
          status: false,
          message: "Username ซ้ำกับในระบบกรุณากรอกข้อมูลใหม่",
          tbUser: null,
        });
    }
  } catch (err) {
    res.json({ status: false, message: err.message, tbUesr: null });
  }
});

router.get("/", async (req, res) => {
  const listUser = await tbUser.findAll({ where: { isDeleted: false } });
  res.json({ status: true, message: "success", tbUser: listUser });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const listUser = await tbUser.findOne({ where: { id: id } });
  res.json({ status: true, message: "success", tbUser: listUser });
});

router.put("/", async (req, res) => {
  const user = await tbUser.findOne({ where: { id: req.body.id } });
  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    if (user.password === req.body.password) {
      const listUser = await tbUser.update(req.body, {
        where: { id: req.body.id },
      });
      res.json({ status: true, message: "success", tbUser: listUser });
    } else {
      bcrypt.hash(req.body.password, 10).then(async (hash) => {
        req.body.password = hash;
        const listUser = await tbUser.update(req.body, {
          where: { id: req.body.id },
        });
        res.json({ status: true, message: "success", tbUser: listUser });
      });
    }
  }
});

router.delete("/multidelete/:userId", (req, res) => {
  const userId = req.params.userId;
  const words = userId.split(",");
  for (const type of words) {
    req.body.isDeleted = true;
    tbUser.update(req.body, { where: { id: type } });
  }
  //res.json("DELETED SUCCESSFULLY");
  res.json({ status: true, message: "success", tbUser: null });
});

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  req.body.isDeleted = true;
  tbUser.update(req.body, { where: { id: userId } });
  res.json({ status: true, message: "success", tbUser: null });
});

module.exports = router;
