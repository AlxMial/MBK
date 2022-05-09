const express = require("express");
const router = express.Router();
const { tbMember } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/", validateToken, async (req, res) => {
  const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
  res.json({ status: true, message: "success", tbMember: listMembers });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const listMembers = await tbMember.findOne({ where: { id: id } });
  res.json({ status: true, message: "success", tbMember: listMembers });
});

router.post("/", async (req, res) => {
  const member = await tbMember.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
      isDeleted: false,
    },
  });

  if (
    (req.body.firstName !== "",
    req.body.lastName !== "",
    req.body.phone !== "",
    req.body.email !== "",
    req.body.birthDate !== "",
    req.body.registerDate !== "",
    req.body.address !== "",
    req.body.uid !== "",
    req.body.sex !== "",
    req.body.sMemberType !== "",
    req.body.memberType !== "")
  ) {
    if (!member) {
      const members = await tbMember.create(req.body);
      res.json({
        status: true,
        isEmail: true,
        isPhone: true,
        message: "success",
        tbMember: members,
      });
    } else {
      if (member.memberCard === req.body.memberCard)
        res.json({
          status: false,
          isEmail: false,
          isPhone: true,
          message: "Unsuccess",
          tbMember: null,
        });
      else if (member.phone === req.body.phone)
        res.json({
          status: false,
          isEmail: true,
          isPhone: false,
          message: "Unsuccess",
          tbMember: null,
        });
    }
  } else {
    res.json({ status: false, error: "value is empty" });
  }
});

router.put("/", async (req, res) => {
  const member = await tbMember.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (
    (req.body.firstName !== "",
    req.body.lastName !== "",
    req.body.phone !== "",
    req.body.email !== "",
    req.body.birthDate !== "",
    req.body.registerDate !== "",
    req.body.address !== "",
    req.body.uid !== "",
    req.body.sex !== "",
    req.body.sMemberType !== "",
    req.body.memberType !== "")
  ) {
    if (!member) {
      const members = await tbMember.update(req.body, {
        where: { id: req.body.id },
      });
      res.json({ status: true, message: "success", tbMember: members });
    } else {
      if (member.memberCard === req.body.memberCard)
        res.json({
          status: false,
          isEmail: false,
          isPhone: true,
          message: "Unsuccess",
          tbMember: null,
        });
      else if (member.phone === req.body.phone)
        res.json({
          status: false,
          isEmail: true,
          isPhone: false,
          message: "Unsuccess",
          tbMember: null,
        });
    }
  } else {
    res.json({ status: false, error: "value is empty" });
  }
});

router.delete("/:memberId", validateToken, async (req, res) => {
  const memberId = req.params.memberId;
  req.body.isDeleted = true;
  tbMember.update(req.body, { where: { id: memberId } });
  res.json({ status: true, message: "success", tbMember: null });
});

router.post("/checkRegister", async (req, res) => {
  let isRegister = false;
  let code = 500;
  let members;
  try {
    const member = await tbMember.findOne({
      where: { uid: req.body.uid, isDeleted: false },
    });

    if (member) {
      members = member;
      isRegister = true;
      code = 200;
    } else {
      isRegister = false;
      code = 200;
    }
  } catch {}
  res.json({
    code: code,
    isRegister: isRegister,
    tbMember: members,
  });
});

module.exports = router;
