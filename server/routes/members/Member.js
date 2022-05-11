const express = require("express");
const router = express.Router();
const { tbMember } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.get("/", async (req, res) => {
  const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
  if (listMembers.length > 0) {
  const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
  Encrypt.encryptValueIdArray(ValuesDecrypt);
  Encrypt.encryptPhoneArray(ValuesDecrypt);
  Encrypt.encryptEmailArray(ValuesDecrypt);
  res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else res.status(403).json({ status: false, message: "not found member", tbMember: null });
});

router.get("/export", async (req, res) => {
  const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
  if (listMembers.length > 0) {
  const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
  Encrypt.encryptValueIdArray(ValuesDecrypt);
  res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else res.status(403).json({ status: false, message: "not found member", tbMember: null });
});

router.get("/byId/:id", async (req, res) => {
  if(req.params.id !== "undefined"){
    const id = Encrypt.DecodeKey(req.params.id);
    const listMembers = await tbMember.findOne({ where: { id: id } });
    Encrypt.decryptAllData(listMembers);
    Encrypt.encryptValueId(listMembers);
    Encrypt.encryptPhone(listMembers);
    Encrypt.encryptEmail(listMembers);
    res.json({ status: true, message: "success", tbMember: listMembers });
  } else {
    res.json({ status: true, message: "success", tbMember: null });
  }
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
      const ValuesEncrypt = Encrypt.encryptAllData(req.body);
      const members = await tbMember.create(ValuesEncrypt);
      const ValuesDecrypt =  Encrypt.decryptAllData(members);
      Encrypt.encryptValueId(ValuesDecrypt);
      Encrypt.encryptPhone(ValuesDecrypt);
      Encrypt.encryptEmail(ValuesDecrypt);
      res.json({
        status: true,
        isEmail: true,
        isPhone: true,
        message: "success",
        tbMember: ValuesDecrypt,
      });
    } else {
      if (member.email === req.body.email)
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
  req.body.id = Encrypt.DecodeKey(req.body.id);
  const ConstMember = await tbMember.findOne({ where: {id : req.body.id} });
  if(ConstMember){
    req.body.phone = ConstMember.dataValues.phone;
    req.body.email = ConstMember.dataValues.email;
  }else{
    res.status(401).json({ status: false, message: "not found id", tbMember: null });
  }

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
      req.body.phone = Encrypt.DecodeKey(req.body.phone);
      req.body.email = Encrypt.DecodeKey(req.body.email);
      Encrypt.encryptAllData(req.body);
      const members = await tbMember.update(req.body, {
        where: { id: req.body.id },
      });
      res.json({ status: true, message: "success", tbMember: members });

    } else {
      if (member.email === req.body.email)
        res.json({
          status: false,
          isEmail: false,
          isPhone: true,
          message: "บันทึกข้อมูลไม่สำเร็จ เนื่องจากรหัสบัตรสมาชิกซ้ำ",
          tbMember: null,
        });
      else if (member.phone === req.body.phone)
        res.json({
          status: false,
          isEmail: true,
          isPhone: false,
          message: "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์ซ้ำ",
          tbMember: null,
        });
    }
  } else {
    res.json({ status: false, error: "value is empty" });
  }
});

router.delete("/:memberId", validateToken, async (req, res) => {
  const memberId = Encrypt.DecodeKey(req.params.memberId);
  req.body.isDeleted = true;
  const ConstMember = await tbMember.findOne({ where: {id : memberId} });
  if(ConstMember){
    req.body.phone = ConstMember.dataValues.phone;
    req.body.email = ConstMember.dataValues.email;
  }else{
    res.status(401).json({ status: false, message: "not found id", tbMember: null });
  }

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
      Encrypt.encryptValueId(member);
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
