const express = require("express");
const router = express.Router();
const { tbMember, tbPointRegister, tbMemberPoint } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const generateMember = require("../../services/generateMember");
const genMember = new generateMember();
const Encrypt = new ValidateEncrypt();
const line = require("@line/bot-sdk");
const config = require("../../services/config.line");

router.get("/", async (req, res) => {
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

router.post("/byUid", validateLineToken, async (req, res) => {
  if (req.body.uid !== "") {
    const listMembers = await tbMember.findOne({
      where: { uid: req.body.uid },
    });
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

      let MemberPoint = {
        campaignType: 3,
        code: null,
        point: point.dataValues.pointRegisterScore,
        redeemDate: new Date(),
        expireDate: new Date(new Date().getFullYear() + 2, 11, 32),
        isDeleted: false,
        tbMemberId: members.id,
        tbPointCodeHDId: null,
      };
      const memberPoint = await tbMemberPoint.create(MemberPoint);

      const ValuesDecrypt = Encrypt.decryptAllData(members);
      Encrypt.encryptValueId(ValuesDecrypt);
      Encrypt.encryptPhone(ValuesDecrypt);
      Encrypt.encryptEmail(ValuesDecrypt);

      const client = new line.Client({
        channelAccessToken: config.lineConfig.bearerToken,
        channelSecret: config.lineConfig.channelSecret,
      });

      client
        .linkRichMenuToUser(req.body.uid, config.lineConfig.menuMember)
        .then((e) => {
          console.log(e);
        });

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
  let accessToken;

  try {
    let member = await tbMember.findOne({
      where: { uid: req.body.uid, isDeleted: false },
    });

    if (member) {
      accessToken = sign(
        {
          id: req.body.uid,
        },
        "LINEMBKPROJECT",
        { expiresIn: "1440m" }
      );
      isRegister = true;
      code = 200;

      const client = new line.Client({
        channelAccessToken: config.lineConfig.bearerToken,
        channelSecret: config.lineConfig.channelSecret,
      });

      client
        .linkRichMenuToUser(req.body.uid, config.lineConfig.menuMember)
        .then((e) => {
          console.log(e);
        });
    } else {
      code = 200;
      isRegister = false;
      accessToken = null;
    }
  } catch {}

  res.json({
    code: code,
    isRegister: isRegister,
    accessToken: accessToken,
  });
});

router.post("/GetMemberpoints", async (req, res) => {
  let code = 500;
  let memberpoints = 0;
  let enddate = new Date(new Date().getFullYear() + "-" + "12" + "-" + "31");
  try {
    code = 200;
    let data = await tbMemberPoint.findAll({
      where: {
        tbMemberId: Encrypt.DecodeKey(req.body.id),
        isDeleted: false,
        $and: [
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("dateField")),
            new Date().getFullYear()
          ),
          { foo: "bar" },
        ],
      },
    });
    if (data) {
      const startdate = new Date(data[0].redeemDate);
      enddate = new Date(
        new Date(new Date().getFullYear() + "-" + "12" + "-" + "31")
      );
      data.filter((e) => {
        if (e.redeemDate >= startdate && e.redeemDate <= enddate) {
          memberpoints = memberpoints + e.point;
        }
      });
    }
  } catch {}
  res.json({
    code: code,
    enddate: enddate,
    memberpoints: memberpoints,
  });
});

module.exports = router;
