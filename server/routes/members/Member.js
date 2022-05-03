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
      [Op.or]: [{ memberCard: req.body.memberCard }, { phone: req.body.phone }],
      isDeleted: false,
    },
  });

  if (!member) {
    const members = await tbMember.create(req.body);
    res.json({
      status: true,
      isMemberCard: true,
      isPhone: true,
      message: "success",
      tbMember: members,
    });
  } else {
    if (member.memberCard === req.body.memberCard)
      res.json({
        status: false,
        isMemberCard: false,
        isPhone: true,
        message: "Unsuccess",
        tbMember: null,
      });
    else if (member.phone === req.body.phone)
      res.json({
        status: false,
        isMemberCard: true,
        isPhone: false,
        message: "Unsuccess",
        tbMember: null,
      });
  }
});

router.put("/", async (req, res) => {
  const member = await tbMember.findOne({
    where: {
      [Op.or]: [{ memberCard: req.body.memberCard }, { phone: req.body.phone }],
      isDeleted: false,
      id: {
        [Op.ne]:req.body.id,
      }
    },
  });

  if (!member) {
    const members = await tbMember.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({ status: true, message: "success", tbMember: members });
  } else {
    if (member.memberCard === req.body.memberCard)
      res.json({
        status: false,
        isMemberCard: false,
        isPhone: true,
        message: "Unsuccess",
        tbMember: null,
      });
    else if (member.phone === req.body.phone)
      res.json({
        status: false,
        isMemberCard: true,
        isPhone: false,
        message: "Unsuccess",
        tbMember: null,
      });
  }
});

router.delete("/:memberId", async (req, res) => {
  const memberId = req.params.memberId;
  req.body.isDeleted = true;
  tbMember.update(req.body, { where: { id: memberId } });
  res.json({ status: true, message: "success", tbMember: null });
});

module.exports = router;
