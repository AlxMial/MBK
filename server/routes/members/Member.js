const express = require("express");
const router = express.Router();
const { tbMember, tbPointRegister } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const generateMember = require("../../services/generateMember");
const genMember = new generateMember();
const Encrypt = new ValidateEncrypt();

router.get("/", async (req, res) => {
  const MemberCards = await genMember.generateMemberCard();
  const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
  if (listMembers.length > 0) {
    const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
    Encrypt.encryptValueIdArray(ValuesDecrypt);
    Encrypt.encryptPhoneArray(ValuesDecrypt);
    Encrypt.encryptEmailArray(ValuesDecrypt);
    res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else res.json({ error: "not found member" });
});

router.get("/export", async (req, res) => {
  const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
  if (listMembers.length > 0) {
    const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
    Encrypt.encryptValueIdArray(ValuesDecrypt);
    res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else
    res.json({ status: false, message: "not found member", tbMember: null });
});

router.get("/byId/:id", async (req, res) => {
  if (req.params.id !== "undefined") {
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
  const MemberCards = await genMember.generateMemberCard();
  const point = await tbPointRegister.findOne({
    where: { isDeleted: false },
    order: [["createdAt", "DESC"]],
  });
  const member = await tbMember.findOne({
    where: {
      [Op.or]: [
        { email: Encrypt.EncodeKey(req.body.email.toLowerCase()) },
        { phone: Encrypt.EncodeKey(req.body.phone) },
        // { memberCard: Encrypt.EncodeKey(req.body.memberCard.toLowerCase()) },
      ],
      isDeleted: false,
    },
  });

  if (
    req.body.firstName !== "" &&
    req.body.lastName !== "" &&
    req.body.phone !== "" &&
    req.body.email !== "" &&
    req.body.birthDate !== "" &&
    req.body.registerDate !== "" &&
    // req.body.address !== "" &&
    // req.body.uid !== "" &&
    req.body.sex !== "" &&
    req.body.sMemberType !== "" &&
    req.body.memberType !== ""
  ) {
    if (!member) {
      req.body.email = req.body.email.toLowerCase();
      req.body.memberCard = MemberCards;
      req.body.memberPoint = point.dataValues.pointRegisterScore;
      const ValuesEncrypt = Encrypt.encryptAllData(req.body);
      const members = await tbMember.create(ValuesEncrypt);
      const ValuesDecrypt = Encrypt.decryptAllData(members);
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
      if (member.email === Encrypt.EncodeKey(req.body.email.toLowerCase()))
        res.json({
          status: false,
          isEmail: true,
          isPhone: false,
          isMemberCard: false,
          message: "Unsuccess",
          tbMember: null,
        });
      else if (member.phone === Encrypt.EncodeKey(req.body.phone))
        res.json({
          status: false,
          isEmail: false,
          isPhone: true,
          isMemberCard: false,
          message: "Unsuccess",
          tbMember: null,
        });
      // else if (
      //   member.memberCard ===
      //   Encrypt.EncodeKey(req.body.memberCard.toLowerCase())
      // )
      //   res.json({
      //     status: false,
      //     isEmail: false,
      //     isPhone: false,
      //     isMemberCard: true,
      //     message: "Unsuccess",
      //     tbMember: null,
      //   });
    }
  } else {
    res.json({ status: false, error: "value is empty" });
  }
});

router.put("/", async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);

  const ConstMember = await tbMember.findOne({ where: { id: req.body.id } });
  if (ConstMember) {
    if (
      req.body.phone ===
      Encrypt.encryptPhone(Encrypt.DecodeKey(ConstMember.dataValues.phone))
    )
      req.body.phone = Encrypt.DecodeKey(ConstMember.dataValues.phone);
    if (
      req.body.email ===
      Encrypt.encryptEmail(Encrypt.DecodeKey(ConstMember.dataValues.email))
    )
      req.body.email = Encrypt.DecodeKey(ConstMember.dataValues.email);
  } else {
    res
      .status(401)
      .json({ status: false, message: "not found id", tbMember: null });
  }
  const member = await tbMember.findOne({
    where: {
      [Op.or]: [
        { email: Encrypt.EncodeKey(req.body.email.toLowerCase()) },
        { phone: Encrypt.EncodeKey(req.body.phone) },
        // { memberCard: Encrypt.EncodeKey(req.body.memberCard.toLowerCase()) },
      ],
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });
  if (
    req.body.firstName !== "" &&
    req.body.lastName !== "" &&
    req.body.phone !== "" &&
    req.body.email !== "" &&
    req.body.birthDate !== "" &&
    req.body.registerDate !== "" &&
    // req.body.address !== "" &&
    // // req.body.uid !== "" &&
    req.body.sex !== "" &&
    req.body.MemberType !== ""
  ) {
    if (!member) {
      req.body.phone = req.body.phone;
      req.body.email = req.body.email.toLowerCase();
      Encrypt.encryptAllData(req.body);
      const members = await tbMember.update(req.body, {
        where: { id: req.body.id },
      });
      res.json({ status: true, message: "success", tbMember: members });
    } else {
      if (member.email === Encrypt.EncodeKey(req.body.email.toLowerCase()))
        res.json({
          status: false,
          isEmail: true,
          isPhone: false,
          isMemberCard: false,
          message: "บันทึกข้อมูลไม่สำเร็จ เนื่องจาก Email ซ้ำภายในระบบ",
          tbMember: null,
        });
      else if (member.phone === Encrypt.EncodeKey(req.body.phone))
        res.json({
          status: false,
          isEmail: false,
          isPhone: true,
          isMemberCard: false,
          message: "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์ซ้ำ",
          tbMember: null,
        });
      // else if (
      //   member.memberCard ===
      //   Encrypt.EncodeKey(req.body.memberCard.toLowerCase())
      // )
      //   res.json({
      //     status: false,
      //     isEmail: false,
      //     isPhone: false,
      //     isMemberCard: true,
      //     message: "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์ซ้ำ",
      //     tbMember: null,
      //   });
    }
  } else {
    res.json({ status: false, error: "value is empty" });
  }
});

router.delete("/:memberId", validateToken, async (req, res) => {
  const memberId = Encrypt.DecodeKey(req.params.memberId);
  req.body.isDeleted = true;
  const ConstMember = await tbMember.findOne({ where: { id: memberId } });
  if (ConstMember) {
    req.body.phone = ConstMember.dataValues.phone;
    req.body.email = ConstMember.dataValues.email;
  } else {
    res
      .status(401)
      .json({ status: false, message: "not found id", tbMember: null });
  }

  tbMember.update(req.body, { where: { id: memberId } });
  res.json({ status: true, message: "success", tbMember: null });
});

router.post("/checkRegister", async (req, res) => {
  let isRegister = false;
  let code = 500;
  let members;

  try {
    let member = await tbMember.findOne({
      where: { uid: req.body.uid, isDeleted: false },
    });
    if (member) {
      member = Encrypt.decryptAllData(member);
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
