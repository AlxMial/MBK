const express = require("express");
const router = express.Router();
const {
  tbMember,
  tbPointRegister,
  tbMemberPoint,
  tbOtherAddress,
  tbOrderHD,
  tbOrderDT,
  tbStock,
  tbMemberReward,
  tbRedemptionCoupon,
  tbCouponCode,
  tbRedemptionConditionsHD,
  tbRedemptionProduct,
  tbCancelOrder,
  tbReturnOrder,
  tbPointCodeHD,
  tbPointCodeDT,
} = require("../../models");
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
const { sign } = require("jsonwebtoken");
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);

// import moment from "moment";
router.get("/", validateToken, async (req, res) => {
  const listMembers = await tbMember.findAll({
    attributes: [
      "id",
      "memberCard",
      "firstName",
      "lastName",
      "phone",
      "email",
      "birthDate",
      "registerDate",
      "address",
      "subDistrict",
      "district",
      "province",
      "country",
      "postcode",
      "isDeleted",
      "uid",
      "isMemberType",
      "memberPoint",
      "memberPointExpire",
      "memberType",
      "consentDate",
      "isPolicy1",
      "isPolicy2",
    ],
    where: { isDeleted: false },
  });
  if (listMembers.length > 0) {
    const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
    Encrypt.encryptValueIdArray(ValuesDecrypt);
    if (Encrypt.DecodeKey(req.user.role) === "3") {
      Encrypt.encryptPhoneArray(ValuesDecrypt);
      Encrypt.encryptEmailArray(ValuesDecrypt);
    }
    res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else res.json({ error: "not found member" });
});

// router.get("/Show", validateToken, async (req, res) => {
//   const listMembers = await tbMember.findAll({ where: { isDeleted: false } });
//   if (listMembers.length > 0) {
//     const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
//     Encrypt.encryptValueIdArray(ValuesDecrypt);
//     res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
//   } else res.json({ error: "not found member" });
// });

router.get("/export", validateToken, async (req, res) => {
  const listMembers = await tbMember.findAll({
    attributes: [
      "id",
      "memberCard",
      "firstName",
      "lastName",
      "sex",
      "phone",
      "email",
      "birthDate",
      "registerDate",
      "address",
      "subDistrict",
      "district",
      "province",
      "country",
      "postcode",
      "isDeleted",
      "uid",
      "isMemberType",
      "memberPoint",
      "memberPointExpire",
      "memberType",
      "consentDate",
      "isPolicy1",
      "isPolicy2",
      "isCustomer",
      "eating",
    ],
    where: { isDeleted: false },
  });
  if (listMembers.length > 0) {
    const ValuesDecrypt = Encrypt.decryptAllDataArray(listMembers);
    Encrypt.encryptValueIdArray(ValuesDecrypt);
    res.json({ status: true, message: "success", tbMember: ValuesDecrypt });
  } else
    res.json({ status: false, message: "not found member", tbMember: null });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = Encrypt.DecodeKey(req.params.id);
    const listMembers = await tbMember.findOne({
      attributes: [
        "id",
        "memberCard",
        "firstName",
        "lastName",
        "phone",
        "email",
        "sex",
        "birthDate",
        "registerDate",
        "address",
        "subDistrict",
        "district",
        "province",
        "country",
        "postcode",
        "isDeleted",
        "uid",
        "isMemberType",
        "memberPoint",
        "memberPointExpire",
        "memberType",
        "consentDate",
        "isPolicy1",
        "isPolicy2",
      ],
      where: { id: id },
    });
    if (listMembers) {
      Encrypt.decryptAllData(listMembers);
      Encrypt.encryptValueId(listMembers);
      if (Encrypt.DecodeKey(req.user.role) === "3") {
        Encrypt.encryptPhone(listMembers);
        Encrypt.encryptEmail(listMembers);
      }
      res.json({ status: true, message: "success", tbMember: listMembers });
    } else {
      res
        .json({ status: false, message: "email not found", tbMember: null });
    }
  } else {
    res.json({ status: true, message: "success", tbMember: null });
  }
});

router.get("/byIdOrder/:id", validateToken, async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = req.params.id;
    const listMembers = await tbMember.findOne({
      attributes: [
        "id",
        "memberCard",
        "firstName",
        "lastName",
        "phone",
        "email",
        "sex",
        "birthDate",
        "registerDate",
        "address",
        "subDistrict",
        "district",
        "province",
        "country",
        "postcode",
        "isDeleted",
        "uid",
        "isMemberType",
        "memberPoint",
        "memberPointExpire",
        "memberType",
        "consentDate",
        "isPolicy1",
        "isPolicy2",
      ],
      where: { id: id },
    });
    if (listMembers) {
      Encrypt.decryptAllData(listMembers);
      Encrypt.encryptValueId(listMembers);
      if (Encrypt.DecodeKey(req.user.role) === "3") {
        Encrypt.encryptPhone(listMembers);
        Encrypt.encryptEmail(listMembers);
      }
      res.json({ status: true, message: "success", tbMember: listMembers });
    } else {
      res
        .json({ status: false, message: "email not found", tbMember: null });
    }
  } else {
    res.json({ status: true, message: "success", tbMember: null });
  }
});

router.get("/byEmail/:email", async (req, res) => {
  if (req.params.email !== "undefined") {
    const email = Encrypt.EncodeKey(req.params.email);
    const listMembers = await tbMember.findOne({
      attributes: [
        "id",
        "memberCard",
        "firstName",
        "lastName",
        "phone",
        "email",
        "sex",
        "birthDate",
        "registerDate",
        "address",
        "subDistrict",
        "district",
        "province",
        "country",
        "postcode",
        "isDeleted",
        "uid",
        "isMemberType",
        "memberPoint",
        "memberPointExpire",
        "memberType",
        "consentDate",
        "isPolicy1",
        "isPolicy2",
      ],
      where: { email: email, isDeleted: false },
    });
    if (listMembers) {
      Encrypt.decryptAllData(listMembers);
      Encrypt.encryptValueId(listMembers);
      Encrypt.encryptPhone(listMembers);
      Encrypt.encryptEmail(listMembers);
      res.json({ status: true, message: "success", tbMember: listMembers });
    } else {
      res.json({ status: true, message: "success", tbMember: null });
    }
  } else {
    res.json({ status: true, message: "success", tbMember: null });
  }
});

router.get("/Show/byId/:id", async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = Encrypt.DecodeKey(req.params.id);
    const listMembers = await tbMember.findOne({
      attributes: [
        "id",
        "memberCard",
        "firstName",
        "lastName",
        "phone",
        "email",
        "sex",
        "birthDate",
        "registerDate",
        "address",
        "subDistrict",
        "district",
        "province",
        "country",
        "postcode",
        "isDeleted",
        "uid",
        "isMemberType",
        "memberPoint",
        "memberPointExpire",
        "memberType",
        "consentDate",
        "isPolicy1",
        "isPolicy2",
      ],
      where: { id: id },
    });
    if (listMembers) {
      Encrypt.decryptAllData(listMembers);
      Encrypt.encryptValueId(listMembers);
      res.json({ status: true, message: "success", tbMember: listMembers });
    } else {
      res
        .status(404)
        .json({ status: false, message: "email not found", tbMember: null });
    }
  } else {
    res.json({ status: true, message: "success", tbMember: null });
  }
});

router.post("/byUid", validateLineToken, async (req, res) => {
  if (req.body.uid !== "") {
    const listMembers = await tbMember.findOne({
      where: { uid: req.body.uid },
    });
    if (listMembers) {
      Encrypt.decryptAllData(listMembers);
      Encrypt.encryptValueId(listMembers);
      Encrypt.encryptPhone(listMembers);
      Encrypt.encryptEmail(listMembers);
      res.json({ status: true, message: "success", tbMember: listMembers });
    } else {
      res
        .status(404)
        .json({ status: false, message: "email not found", tbMember: null });
    }
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
    !Encrypt.IsNullOrEmpty(req.body.firstName) &&
    !Encrypt.IsNullOrEmpty(req.body.lastName) &&
    !Encrypt.IsNullOrEmpty(req.body.phone) &&
    !Encrypt.IsNullOrEmpty(req.body.email) &&
    !Encrypt.IsNullOrEmpty(req.body.birthDate) &&
    !Encrypt.IsNullOrEmpty(req.body.registerDate) &&
    !Encrypt.IsNullOrEmpty(req.body.sex) &&
    !Encrypt.IsNullOrEmpty(req.body.isMemberType) &&
    !Encrypt.IsNullOrEmpty(req.body.memberType)
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
      .status(404)
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
  console.log(member);
  if (
    !Encrypt.IsNullOrEmpty(req.body.firstName) &&
    !Encrypt.IsNullOrEmpty(req.body.lastName) &&
    !Encrypt.IsNullOrEmpty(req.body.phone) &&
    !Encrypt.IsNullOrEmpty(req.body.email) &&
    !Encrypt.IsNullOrEmpty(req.body.birthDate) &&
    !Encrypt.IsNullOrEmpty(req.body.registerDate) &&
    !Encrypt.IsNullOrEmpty(req.body.sex) &&
    !Encrypt.IsNullOrEmpty(req.body.memberType)
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

  const client = new line.Client({
    channelAccessToken: config.lineConfig.bearerToken,
    channelSecret: config.lineConfig.channelSecret,
  });

  client
    .linkRichMenuToUser(req.body.uid, config.lineConfig.menuRegister)
    .then((e) => {
      console.log(e);
    });

  tbMember.update(req.body, { where: { id: memberId } });
  res.json({ status: true, message: "success", tbMember: null });
});

/* line  */
router.post("/checkRegister", async (req, res) => {
  let isRegister = false;
  let code = 500;
  let accessToken;

  try {
    // const [results, data] = await sequelize.query(`update  tbpointcodedts set isExpire = 1 where tbPointCodeHDId in (select id from tbpointcodehds where endDate < now() and isDeleted = 0 )`);

    let member = await tbMember.findOne({
      where: { uid: req.body.uid, isDeleted: false },
    });
    if (member) {
      accessToken = sign(
        {
          id: Encrypt.EncodeKey(member.id),
          uid: Encrypt.EncodeKey(member.uid),
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
  } catch (e) {
    console.log(e);
  }

  res.json({
    code: code,
    isRegister: isRegister,
    accessToken: accessToken,
  });
});

router.get("/getMember", validateLineToken, async (req, res) => {
  let code = 500;
  let members;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    let member = await tbMember.findOne({
      where: { uid: uid, isDeleted: false },
    });
    code = 200;
    if (member) {
      member = Encrypt.decryptAllData(member);
      Encrypt.encryptValueId(member);
      members = member;
    }
  } catch (e) {
    code = 300;
  }

  res.json({
    code: code,
    tbMember: members,
  });
});

router.get("/getMemberPoints", validateLineToken, async (req, res) => {
  let code = 500;
  let memberpoints = 0;
  let msg;
  const id = Encrypt.DecodeKey(req.user.id);
  let enddate = new Date(new Date().getFullYear() + "-" + "12" + "-" + "31");
  try {
    code = 200;
    let data = await tbMemberPoint.findAll({
      where: {
        tbMemberId: id,
        isDeleted: false,
      },
    });
    if (data) {
      // const startdate = new Date(data[0].redeemDate);
      enddate = new Date(
        new Date(new Date().getFullYear() + "-" + "12" + "-" + "31")
      );
      data.filter((e) => {
        if (e.redeemDate.getFullYear() === new Date().getFullYear()) {
          memberpoints = memberpoints + e.point;
        }
      });
    }
  } catch (e) {
    code = 300;
    // console.log(e);
  }
  res.json({
    code: code,
    enddate: enddate,
    memberpoints: memberpoints,
    msg: msg,
  });
});

router.get("/getMemberPointsList", validateLineToken, async (req, res) => {
  let status = true;
  let msg = "";
  let tbMemberPointList;
  // const id = Encrypt.DecodeKey(req.user.id);
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    let Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    let data = await tbMemberPoint.findAll({
      attributes: ["campaignType", "point", "redeemDate"],
      where: {
        tbMemberId: Member.id,
        isDeleted: false,
      },
      order: [["redeemDate", "DESC"]],
    });
    if (data) {
      tbMemberPointList = data;
    }
  } catch (e) {
    msg = e.message;
    status = false;
  }
  res.json({
    status: status,
    tbMemberPoint: tbMemberPointList,
  });
});

router.get("/getMemberAddress", validateLineToken, async (req, res) => {
  let code = 500;
  const id = Encrypt.DecodeKey(req.user.id);
  // let members;
  let option = [];
  try {
    code = 200;
    let member = await tbMember.findOne({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "address",
        "province",
        "district",
        "subDistrict",
        "postcode",
        "email",
      ],
      where: { id: id, isDeleted: false },
    });

    if (member) {
      member = Encrypt.decryptAllData(member);
      Encrypt.encryptValueId(member);
      let dataValues = member.dataValues;
      dataValues.isDefault = true;
      dataValues.id = Encrypt.EncodeKey("memberId");
      option.push(dataValues);

      let OtherAddress = await tbOtherAddress.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "address",
          "province",
          "district",
          "subDistrict",
          "postcode",
          "email",
        ],
        where: { memberID: id },
      });
      if (OtherAddress) {
        OtherAddress.map((e, i) => {
          let _OtherAddress = Encrypt.decryptAllData(e);
          Encrypt.encryptValueId(_OtherAddress);

          let dataValues = _OtherAddress.dataValues;
          dataValues.isDefault = false;
          option.push(dataValues);
        });
      }
    }
  } catch (e) {
    code = 300;
  }

  res.json({
    code: code,
    option: option,
  });
});

router.post("/addMemberAddress", validateLineToken, async (req, res) => {
  const uid = Encrypt.DecodeKey(req.user.uid);
  let data = req.body;
  let Member;
  let msg;
  try {
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      if (
        !Encrypt.IsNullOrEmpty(data.firstName) &&
        !Encrypt.IsNullOrEmpty(data.lastName) &&
        !Encrypt.IsNullOrEmpty(data.phone)
        // &&
        // !Encrypt.IsNullOrEmpty(data.email)
      ) {
        if (data.email) {
          data.email = data.email.toLowerCase();
        }
        data.memberID = Member.id;
        const ValuesEncrypt = Encrypt.encryptAllData(data);
        const MemberAddress = await tbOtherAddress.create(ValuesEncrypt);
        res.json({ status: true });
      } else {
        res.json({ status: false, msg: "Data Empty" });
      }
    } else {
      res.json({ status: false, msg: "Member Empty" });
    }
  } catch (e) {
    msg = e.message;
    res.json({ status: false, msg: msg, Member: Member });
  }
});

router.get("/getMyOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let OrderHD = [];
  try {
    const memberId = Encrypt.DecodeKey(req.user.id);
    tbOrderHD.hasMany(tbOrderDT, {
      foreignKey: "orderId",
    });

    const _tbOrderHD = await tbOrderHD.findAll({
      limit: 5,
      attributes: [
        "id",
        "orderNumber",
        "paymentStatus",
        "netTotal",
        "stockNumber",
        "isCancel",
        "isReturn",
      ],
      where: {
        memberId: memberId,
        isCancel: false,
        isReturn: false,
      },
      include: [
        {
          limit: 2,
          attributes: [
            "id",
            "amount",
            "price",
            "discount",
            "discountType",
            "stockId",
            "orderId",
          ],
          model: tbOrderDT,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbCancelOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbReturnOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
      ],
      order: [["orderNumber", "DESC"]],
    });

    if (_tbOrderHD && _tbOrderHD.length > 0) {
      for (let i = 0; i < _tbOrderHD.length; i++) {
        let hd = _tbOrderHD[i].dataValues;
        hd.dt = [];
        if (hd.tbOrderDTs) {
          for (var j = 0; j < hd.tbOrderDTs.length; j++) {
            let dt = hd.tbOrderDTs[j].dataValues;
            dt.id = Encrypt.EncodeKey(dt.id);
            const _tbStockData = await tbStock.findOne({
              attributes: ["productName"],
              where: { id: dt.stockId },
            });
            let _tbStock = _tbStockData.dataValues;
            dt.productName = _tbStock.productName;

            let discount =
              dt.discount > 0
                ? // ? dt.discountType == 1
                  //   ? parseFloat(dt.price) - parseFloat(dt.discount)
                  //   : parseFloat(dt.price) -
                  //   (parseFloat(dt.discount) / 100) * parseFloat(dt.price)
                  parseFloat(dt.price) - parseFloat(dt.discount)
                : 0;

            if (j < 2) {
              hd.dt.push({
                id: Encrypt.EncodeKey(dt.stockId),
                price: parseFloat(dt.price),
                discount: parseFloat(discount),
                productName: dt.productName,
                amount: dt.amount,
              });
            }
          }
        }
        hd.id = Encrypt.EncodeKey(hd.id);
        if (hd.paymentStatus == 2) {
          hd.isPaySlip = true;
        } else {
          hd.isPaySlip = false;
        }
        OrderHD.push(hd);
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    OrderHD: OrderHD,
  });
});

/// คูปอง รวม product อย่างละ 2 row
router.get("/getMyReward", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let coupon = [];
  let product = [];
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //Coupon

      let _coupon = await tbMemberReward.findAll({
        // limit: 2,
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Coupon",
          isUsedCoupon: false,
        },
      });

      if (_coupon) {
        for (var i = 0; i < _coupon.length; i++) {
          tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
          tbCouponCode.belongsTo(tbRedemptionCoupon, {
            foreignKey: "redemptionCouponId",
          });

          const _tbCouponCode = await tbCouponCode.findOne({
            attributes: ["id"],
            where: {
              isDeleted: false,
              id: _coupon[i].TableHDId,
            },
            include: [
              {
                model: tbRedemptionCoupon,
                attributes: [
                  "id",
                  "couponName",
                  "isNotExpired",
                  "startDate",
                  "expireDate",
                ],
                where: { isDeleted: false },
              },
            ],
          });

          if (_tbCouponCode) {
            let _RedemptionCoupon =
              _tbCouponCode.dataValues.tbRedemptionCoupon.dataValues;

            if (
              _RedemptionCoupon.startDate <= new Date() &&
              _RedemptionCoupon.expireDate >= new Date()
            ) {
              _coupon[i].dataValues.couponName = _RedemptionCoupon.couponName;
              _coupon[i].dataValues.expireDate = _RedemptionCoupon.expireDate;
              if (coupon.length < 2) {
                coupon.push({
                  id: Encrypt.EncodeKey(_RedemptionCoupon.id),
                  couponId: Encrypt.EncodeKey(_coupon[i].TableHDId),
                  couponName: _coupon[i].dataValues.couponName,
                  expireDate: _coupon[i].dataValues.expireDate,
                });
              }
            }
          }
        }
      }

      //product
      let _product = await tbMemberReward.findAll({
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Product",
        },
      });
      if (_product) {
        for (var i = 0; i < _product.length; i++) {
          const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
            attributes: ["id", "productName"],
            where: {
              isDeleted: false,
              id: _product[i].TableHDId,
            },
          });
          if (_tbRedemptionProduct) {
            const _RedemptionProduct = _tbRedemptionProduct.dataValues;

            const productName = _RedemptionProduct.productName;
            const trackingNo = _product[i].trackingNo;
            const deliverStatus = _product[i].deliverStatus;
            /// 1 = เตรียมจัดส่ง 2 = อยู่ระหว่างจัดส่ง 3 = ส่งแล้ว
            const data = {
              id: Encrypt.EncodeKey(_RedemptionProduct.id),
              productId: Encrypt.EncodeKey(_product[i].id),
              productName: productName,
              trackingNo: trackingNo,
              status:
                deliverStatus == "Wait"
                  ? 1
                  : deliverStatus == "InTransit"
                  ? 2
                  : 3,
            };
            if (product.length < 2) {
              product.push(data);
            }
          }
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    coupon: coupon,
    product: product,
  });
});

//หน้า Coupon
router.get("/getMyCoupon", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let coupon = [];
  // let product;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //Coupon
      let _coupon = await tbMemberReward.findAll({
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Coupon",
        },
      });
      console.log(_coupon);
      if (_coupon) {
        for (var i = 0; i < _coupon.length; i++) {
          tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
          tbCouponCode.belongsTo(tbRedemptionCoupon, {
            foreignKey: "redemptionCouponId",
          });

          const _tbCouponCode = await tbCouponCode.findOne({
            attributes: ["id"],
            where: {
              isDeleted: false,
              id: _coupon[i].TableHDId,
            },
            include: [
              {
                model: tbRedemptionCoupon,
                attributes: [
                  "id",
                  "redemptionConditionsHDId",
                  "couponName",
                  "isNotExpired",
                  "startDate",
                  "expireDate",
                  "isDeleted",
                ],
                // where: { isDeleted: false },
              },
            ],
          });
          if (_tbCouponCode) {
            let _RedemptionCoupon =
              _tbCouponCode.dataValues.tbRedemptionCoupon.dataValues;

            const _tbRedemptionConditionsHD =
              await tbRedemptionConditionsHD.findOne({
                attributes: ["points"],
                where: {
                  // isDeleted: false,
                  id: _RedemptionCoupon.redemptionConditionsHDId,
                },
              });

            let couponName = _RedemptionCoupon.couponName;
            let data = {
              id: Encrypt.EncodeKey(_RedemptionCoupon.id),
              couponName: couponName,
              isUse: !_coupon[i].isUsedCoupon
                ? _RedemptionCoupon.expireDate <= new Date() &&
                  _RedemptionCoupon.startDate >= new Date()
                  ? true
                  : false
                : false,
              isUsedCoupon: _coupon[i].isUsedCoupon,
              points: _tbRedemptionConditionsHD.dataValues.points,
              expiredDate: _RedemptionCoupon.expireDate,
              isDeleted: _RedemptionCoupon.isDeleted,
              CouponCodeId: Encrypt.EncodeKey(_coupon[i].TableHDId),
            };
            coupon.push(data);
          }
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    coupon: coupon,
    // product: product,
  });
});

router.get("/getMyProduct", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let product = [];
  // let product;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //Coupon
      let _product = await tbMemberReward.findAll({
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Product",
        },
      });
      if (_product) {
        for (var i = 0; i < _product.length; i++) {
          const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
            attributes: ["id", "productName", "description"],
            where: {
              isDeleted: false,
              id: _product[i].TableHDId,
            },
          });
          if (_tbRedemptionProduct) {
            const _RedemptionProduct = _tbRedemptionProduct.dataValues;

            const productName = _RedemptionProduct.productName;
            const trackingNo = _product[i].trackingNo;
            const deliverStatus = _product[i].deliverStatus;
            const description = _RedemptionProduct.description;
            /// 1 = เตรียมจัดส่ง 2 = อยู่ระหว่างจัดส่ง 3 = ส่งแล้ว
            const data = {
              id: Encrypt.EncodeKey(_RedemptionProduct.id),
              productId: Encrypt.EncodeKey(_product[i].id),
              productName: productName,
              trackingNo: trackingNo,
              description: description,
              status:
                deliverStatus == "Wait"
                  ? 1
                  : deliverStatus == "InTransit"
                  ? 2
                  : 3,
            };
            product.push(data);
          }
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    product: product,
  });
});

router.post("/getCouponByID", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let coupon;
  let product;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const CouponCodeId = Encrypt.DecodeKey(req.body.Id);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //Coupon
      let _coupon = await tbMemberReward.findOne({
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Coupon",
          TableHDId: CouponCodeId,
        },
      });
      if (_coupon) {
        const _updateCoupon = await tbMemberReward.update(
          { isUsedCoupon: true },
          {
            where: {
              memberId: Member.id,
              rewardType: "Coupon",
              TableHDId: CouponCodeId,
            },
          }
        );

        let data = _coupon.dataValues;
        tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
        tbCouponCode.belongsTo(tbRedemptionCoupon, {
          foreignKey: "redemptionCouponId",
        });

        const _tbCouponCode = await tbCouponCode.findOne({
          attributes: ["id", "codeCoupon"],
          where: {
            isDeleted: false,
            id: data.TableHDId,
          },
          include: [
            {
              model: tbRedemptionCoupon,
              attributes: [
                "id",
                "couponName",
                "description",
                "redemptionConditionsHDId",
              ],
              where: { isDeleted: false },
            },
          ],
        });
        if (_tbCouponCode) {
          let _RedemptionCoupon =
            _tbCouponCode.dataValues.tbRedemptionCoupon.dataValues;

          const _tbRedemptionConditionsHD =
            await tbRedemptionConditionsHD.findOne({
              attributes: ["points"],
              where: {
                isDeleted: false,
                id: _RedemptionCoupon.redemptionConditionsHDId,
              },
            });
          let points = 0;
          if (_tbRedemptionConditionsHD) {
            points = _tbRedemptionConditionsHD.dataValues.points;
          }
          let codeCoupon = Encrypt.DecodeKey(
            _tbCouponCode.dataValues.codeCoupon
          );
          let couponName = _RedemptionCoupon.couponName;
          let description = _RedemptionCoupon.description;
          let redemptionCouponId = Encrypt.EncodeKey(_RedemptionCoupon.id);
          coupon = {
            id: req.body.Id,
            redemptionCouponId: redemptionCouponId,
            couponName: couponName,
            description: description,
            points: points,
            codeCoupon: codeCoupon,
          };
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    coupon: coupon,
    product: product,
  });
});

router.post("/getMyProductById", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let ProductItem;

  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const productId = Encrypt.DecodeKey(req.body.Id);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      let _product = await tbMemberReward.findOne({
        attributes: [
          "id",
          "rewardType",
          "TableHDId",
          "deliverStatus",
          "redeemDate",
          "isUsedCoupon",
          "trackingNo",
        ],
        where: {
          memberId: Member.id,
          rewardType: "Product",
          id: productId,
        },
      });
      if (_product) {
        const product = _product.dataValues;
        const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
          attributes: ["id", "productName", "description"],
          where: {
            isDeleted: false,
            id: product.TableHDId,
          },
        });
        const deliverStatus = product.deliverStatus;
        if (_tbRedemptionProduct) {
          const tbRedemptionProduct = _tbRedemptionProduct.dataValues;
          ProductItem = {
            id: Encrypt.EncodeKey(_tbRedemptionProduct.id),
            productName: tbRedemptionProduct.productName,
            description: tbRedemptionProduct.description,
            trackingNo: product.trackingNo,
            status:
              deliverStatus == "Wait"
                ? 1
                : deliverStatus == "InTransit"
                ? 2
                : 3,
          };
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    Product: ProductItem,
  });
});

router.post("/checkDuplicate", async (req, res) => {
  const Member = await tbMember.findOne({
    attributes: ["id", "email", "phone"],
    where: {
      [Op.or]: [
        { email: Encrypt.EncodeKey(req.body.email.toLowerCase()) },
        { phone: Encrypt.EncodeKey(req.body.phone) },
      ],
      isDeleted: false,
    },
  });

  if (Member) {
    if (Member.email === Encrypt.EncodeKey(req.body.email.toLowerCase())) {
      return res.json({
        status: false,
        isEmail: true,
        isPhone: false,
        msg: "unsuccess email",
      });
    } else if (Member.phone === Encrypt.EncodeKey(req.body.phone)) {
      return res.json({
        status: false,
        isEmail: false,
        isPhone: true,
        msg: "unsuccess phone",
      });
    } else {
      return res.json({
        status: true,
        isEmail: false,
        isPhone: false,
        msg: "success",
      });
    }
  } else {
    return res.json({
      status: true,
      isEmail: false,
      isPhone: false,
      msg: "success",
    });
  }
});
router.get(
  "/getMemberpointsByMemberID/:type/:id",
  validateToken,
  async (req, res) => {
    let status = true;
    let msg;
    let MemberPoint = [];
    let Campaign = [];
    // let product;
    try {
      const id = Encrypt.DecodeKey(req.params.id);
      if (req.params.type != "earnPoints") {
        tbRedemptionConditionsHD.hasMany(tbRedemptionCoupon, {
          foreignKey: "redemptionConditionsHDId",
        });
        tbRedemptionConditionsHD.hasMany(tbRedemptionProduct, {
          foreignKey: "redemptionConditionsHDId",
        });

        tbRedemptionProduct.hasMany(tbMemberReward, {
          foreignKey: "TableHDId",
        });
        tbRedemptionCoupon.hasMany(tbCouponCode, {
          foreignKey: "redemptionCouponId",
        });

        tbCouponCode.hasMany(tbMemberReward, {
          foreignKey: "TableHDId",
        });

        //#region คูปอง

        const CouponData = await tbRedemptionConditionsHD.findAll({
          attributes: [
            ["redemptionName", "CampaignName"],
            "redemptionType",
            "rewardType",
            "points",
          ],
          include: [
            {
              attributes: ["couponName", "expiredDate"],
              model: tbRedemptionCoupon,
              where: {
                isDeleted: false,
              },
              include: [
                {
                  attributes: ["id", "codeCoupon"],
                  model: tbCouponCode,
                  where: {
                    isDeleted: false,
                  },
                  required: true,
                  include: [
                    {
                      attributes: ["id", "redeemDate"],
                      model: tbMemberReward,
                      where: {
                        isDeleted: false,
                        memberId: id,
                      },
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        });
        if (CouponData) {
          CouponData.map((e, i) => {
            let CampaignName = e.dataValues.CampaignName;
            let redemptionType =
              e.dataValues.redemptionType == 1 ? "Standard" : "Game";
            let rewardType =
              e.dataValues.rewardType == 1 ? "E-Coupon" : "Product";
            let points = e.dataValues.points;
            let campaignType =
              e.dataValues.redemptionType == 1
                ? e.dataValues.rewardType == 1
                  ? 4
                  : 5
                : 6;
            if (e.tbRedemptionCoupons.length > 0) {
              e.tbRedemptionCoupons.map((rc, rcii) => {
                let expiredDate = rc.dataValues.expiredDate;
                if (rc.tbCouponCodes.length > 0) {
                  rc.tbCouponCodes.map((cc, cci) => {
                    let codeCoupon = Encrypt.DecodeKey(
                      cc.codeCoupon
                    ).toLocaleUpperCase();
                    if (cc.tbMemberRewards) {
                      let redeemDate =
                        cc.tbMemberRewards[0].dataValues.redeemDate;

                      Campaign.push({
                        CampaignName: CampaignName,
                        campaignType: campaignType,
                        redemptionType: redemptionType,
                        rewardType: rewardType,
                        code: codeCoupon,
                        points: points,
                        redeemDate: redeemDate,
                        expiredDate: expiredDate,
                      });
                    }
                  });
                }
              });
            }
          });
        }
        //#endregion คูปอง
        //#region สินค้า productName
        const productNameData = await tbRedemptionConditionsHD.findAll({
          attributes: [
            ["redemptionName", "CampaignName"],
            "redemptionType",
            "rewardType",
            "points",
          ],
          include: [
            {
              attributes: ["productName"],
              model: tbRedemptionProduct,
              where: {
                isDeleted: false,
              },
              include: [
                {
                  attributes: [
                    "id",
                    // "rewardType",
                    "redeemDate",
                  ],
                  model: tbMemberReward,
                  where: {
                    isDeleted: false,
                    memberId: id,
                  },
                  required: true,
                },
              ],
            },
          ],
        });
        if (productNameData) {
          productNameData.map((e, i) => {
            let CampaignName = e.dataValues.CampaignName;
            let redemptionType =
              e.dataValues.redemptionType == 1 ? "Standard" : "Game";
            let rewardType =
              e.dataValues.rewardType == 1 ? "E-Coupon" : "Product";
            let points = e.dataValues.points;
            let campaignType =
              e.dataValues.redemptionType == 1
                ? e.dataValues.rewardType == 1
                  ? 4
                  : 5
                : 6;
            if (e.tbRedemptionProducts) {
              let expiredDate = "";
              e.tbRedemptionProducts.map((rp, rpi) => {
                if (rp.tbMemberRewards) {
                  let redeemDate = rp.tbMemberRewards[0].dataValues.redeemDate;

                  Campaign.push({
                    CampaignName: CampaignName,
                    campaignType: campaignType,
                    redemptionType: redemptionType,
                    rewardType: rewardType,
                    points: points,
                    redeemDate: redeemDate,
                    expiredDate: expiredDate,
                  });
                }
              });
            }
          });
        }
        //#endregion สินค้า productName
      
      } else {
        const _tbMemberPoint = await tbMemberPoint.findAll({
          attributes: [
            "id",
            "campaignType",
            "campaignType",
            "code",
            "redeemDate",
            "expireDate",
            "point",
          ],
          where: { tbMemberId: id, campaignType: [1, 2, 3] },
          order: [["redeemDate", "DESC"]],
        });

        if (_tbMemberPoint) {
          MemberPoint = _tbMemberPoint;
          _tbMemberPoint.map((e, i) => {
            if (e.campaignType == 2) {
              let CampaignName = "คะแนนจากซื้อสินค้า";
              let redemptionType = "E-commerce";
              let rewardType = "";
              let points = e.point;
              let campaignType = e.campaignType;
              Campaign.push({
                CampaignName: CampaignName,
                campaignType: campaignType,
                redemptionType: redemptionType,
                rewardType: rewardType,
                points: points,
                redeemDate: e.redeemDate,
                expiredDate: e.expireDate,
              });
            } else if (e.campaignType == 3) {
              let CampaignName = "ลงทะเบียน";
              let redemptionType = "Register";
              let rewardType = "";
              let points = e.point;
              let campaignType = e.campaignType;
              Campaign.push({
                CampaignName: CampaignName,
                campaignType: campaignType,
                redemptionType: redemptionType,
                rewardType: rewardType,
                points: points,
                redeemDate: e.redeemDate,
                expiredDate: e.expireDate,
              });
            }

            //
          });

          let _pointcode = [];
          let _point = [];

          _tbMemberPoint.filter((e) => {
            if (e.campaignType == 1) {
              // return e
              _pointcode.push(e.code);
              _point.push(e.point);
            }
          });

          if (_point.length > 0) {
            tbPointCodeHD.hasMany(tbPointCodeDT, {
              foreignKey: "tbPointCodeHDId",
            });
            const _tbPointCodeHD = await tbPointCodeHD.findAll({
              attributes: [["pointCodeName", "CampaignName"]],
              include: [
                {
                  attributes: ["id", "code"],
                  model: tbPointCodeDT,
                  where: {
                    isDeleted: false,
                    code: _pointcode,
                    isUse: true,
                    memberId: id,
                  },
                  order: [
                    ["id", "DESC"],
                    ["isUse", "DESC"],
                  ],
                  required: true,
                },
              ],
              order: [["id", "DESC"]],
              where: {
                pointCodePoint: _point,
              },
              required: true,
            });
            if (_tbPointCodeHD) {
              _tbPointCodeHD.map((e, i) => {
                let CampaignName = e.dataValues.CampaignName;
                let redemptionType = "";
                let rewardType = "";
                // let points = ""
                let campaignType = 1;
                if (e.tbPointCodeDTs) {
                  e.tbPointCodeDTs.map((pc, i) => {
                    let code = pc.code;
                    let item = _tbMemberPoint.find((e) => e.code == code);
                    Campaign.push({
                      CampaignName: CampaignName,
                      campaignType: campaignType,
                      redemptionType: redemptionType,
                      rewardType: rewardType,
                      points: item.dataValues.point,
                      redeemDate: item.dataValues.redeemDate,
                      expiredDate: item.dataValues.expireDate,
                    });
                  });
                }
              });
            }
          }
        }
      }
    } catch (e) {
      status = false;
      msg = e.message;
    }

    return res.json({
      status: status,
      msg: msg,
      Campaign: Campaign,
    });
  }
);

module.exports = router;
