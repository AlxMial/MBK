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
  tbRedemptionProduct
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
        .status(404)
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

  tbMember.update(req.body, { where: { id: memberId } });
  res.json({ status: true, message: "success", tbMember: null });
});

/* line  */
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
  const id = Encrypt.DecodeKey(req.user.id);
  let members;
  try {
    let member = await tbMember.findOne({
      where: { id: id, isDeleted: false },
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
  let code = 500;
  let tbMemberPointList;
  const id = Encrypt.DecodeKey(req.user.id);
  try {
    code = 200;
    let data = await tbMemberPoint.findAll({
      where: {
        tbMemberId: id,
        isDeleted: false,
      },
    });
    if (data) {
      tbMemberPointList = data;
    }
  } catch { }
  res.json({
    code: code,
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
        !Encrypt.IsNullOrEmpty(data.phone) &&
        !Encrypt.IsNullOrEmpty(data.email)
      ) {
        data.email = data.email.toLowerCase();
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
    res.json({ status: false, msg: msg });
  }
});

router.get("/getMyOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let OrderHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      const _tbOrderHD = await tbOrderHD.findAll({
        limit: 1,
        attributes: ["id", "orderNumber", "paymentStatus"],
        where: { memberId: Member.id },
      });
      if (_tbOrderHD) {
        let hd = _tbOrderHD[0].dataValues;
        hd.dt = [];
        const OrderDTData = await tbOrderDT.findAll({
          // limit: 2,
          attributes: [
            "id",
            "amount",
            "price",
            "discount",
            "discountType",
            "stockId",
            "orderId",
          ],
          where: { IsDeleted: false, orderId: hd.id },
        });
        let sumamount = 0;
        let sumprice = 0;
        for (var j = 0; j < OrderDTData.length; j++) {
          let dt = OrderDTData[j].dataValues;
          dt.id = Encrypt.EncodeKey(dt.id);
          const _tbStockData = await tbStock.findOne({
            attributes: [
              "id",
              "productName",
              "discount",
              "discountType",
              "price",
            ],
            where: { id: dt.stockId },
          });
          let _tbStock = _tbStockData.dataValues;
          dt.productName = _tbStock.productName;
          let price =
            dt.discount > 0
              ? dt.discountType == "THB"
                ? parseFloat(dt.price) - parseFloat(dt.discount)
                : parseFloat(dt.price) -
                (parseFloat(dt.discount) / 100) * parseFloat(dt.price)
              : parseFloat(dt.price);
          let discount =
            dt.discount > 0
              ? dt.discountType == "THB"
                ? parseFloat(dt.price) - parseFloat(dt.discount)
                : parseFloat(dt.price) -
                (parseFloat(dt.discount) / 100) * parseFloat(dt.price)
              : 0;
          sumamount += dt.amount;
          sumprice += price * dt.amount;
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
        hd.sumamount = sumamount;
        hd.sumprice = sumprice;
        hd.id = Encrypt.EncodeKey(hd.id);
        OrderHD = hd;
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
                  "expiredDate",
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
              _RedemptionCoupon.expiredDate >= new Date()
            ) {
              _coupon[i].dataValues.couponName = _RedemptionCoupon.couponName;
              _coupon[i].dataValues.expiredDate = _RedemptionCoupon.expiredDate;
              if (coupon.length < 2) {
                coupon.push({
                  id: Encrypt.EncodeKey(_RedemptionCoupon.id),
                  couponName: _coupon[i].dataValues.couponName,
                  expiredDate: _coupon[i].dataValues.expiredDate,
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
            const _RedemptionProduct =
              _tbRedemptionProduct.dataValues;

            const productName = _RedemptionProduct.productName;
            const trackingNo = _product[i].trackingNo;
            const deliverStatus = _product[i].deliverStatus;
            /// 1 = เตรียมจัดส่ง 2 = อยู่ระหว่างจัดส่ง 3 = ส่งแล้ว
            const data = {
              id: Encrypt.EncodeKey(_RedemptionProduct.id)
              , productName: productName
              , trackingNo: trackingNo
              , status: deliverStatus == "Wait" ? 1 : deliverStatus == "InTransit" ? 2 : 3
            }
            if (product.length < 2) {
              product.push(data)
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
                  "expiredDate",
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

            let couponName = _RedemptionCoupon.couponName;
            let data = {

              id: Encrypt.EncodeKey(_RedemptionCoupon.id), couponName: couponName
              , isUse: !_coupon[i].isUsedCoupon ? (_RedemptionCoupon.expiredDate <= new Date() && _RedemptionCoupon.startDate >= new Date()) ? true : false : false
              , isUsedCoupon: _coupon[i].isUsedCoupon
              , points: _tbRedemptionConditionsHD.dataValues.points
              , expiredDate: _RedemptionCoupon.expiredDate
              , CouponCodeId: Encrypt.EncodeKey(_coupon[i].TableHDId)
            }
            coupon.push(data)
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
            const _RedemptionProduct =
              _tbRedemptionProduct.dataValues;

            const productName = _RedemptionProduct.productName;
            const trackingNo = _product[i].trackingNo;
            const deliverStatus = _product[i].deliverStatus;
            const description = _RedemptionProduct.description
            /// 1 = เตรียมจัดส่ง 2 = อยู่ระหว่างจัดส่ง 3 = ส่งแล้ว
            const data = {
              id: Encrypt.EncodeKey(_RedemptionProduct.id)
              , productName: productName
              , trackingNo: trackingNo
              , description: description
              , status: deliverStatus == "Wait" ? 1 : deliverStatus == "InTransit" ? 2 : 3
            }
            product.push(data)
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
    Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
    if (Member) {
      //Coupon 
      let _coupon = await tbMemberReward.findOne({
        attributes: ["id", "rewardType", "TableHDId", "deliverStatus", "redeemDate", "isUsedCoupon", "trackingNo"]
        , where: {
          memberId: Member.id
          , rewardType: "Coupon"
          , TableHDId: CouponCodeId
        }
      })
      if (_coupon) {
        let data = _coupon.dataValues
        tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
        tbCouponCode.belongsTo(tbRedemptionCoupon, { foreignKey: "redemptionCouponId" });

        const _tbCouponCode = await tbCouponCode.findOne({
          attributes: ["id", "codeCoupon"],
          where: {
            isDeleted: false,
            id: data.TableHDId
          },
          include: [
            {
              model: tbRedemptionCoupon,
              attributes: ["id", "couponName", "description", "redemptionConditionsHDId"],
              where: { isDeleted: false },
            },
          ],
        });
        if (_tbCouponCode) {
          let _RedemptionCoupon = _tbCouponCode.dataValues.tbRedemptionCoupon.dataValues

          const _tbRedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
            attributes: ["points"],
            where: {
              isDeleted: false,
              id: _RedemptionCoupon.redemptionConditionsHDId
            }
          })
          let points = 0
          if (_tbRedemptionConditionsHD) {
            points = _tbRedemptionConditionsHD.dataValues.points
          }
          let codeCoupon = _tbCouponCode.dataValues.codeCoupon
          let couponName = _RedemptionCoupon.couponName
          let description = _RedemptionCoupon.description
          let redemptionCouponId = Encrypt.EncodeKey(_RedemptionCoupon.id)
          coupon = { id: req.body.Id, redemptionCouponId: redemptionCouponId, couponName: couponName, description: description, points: points, codeCoupon: codeCoupon }
        }
      }
    }

  } catch (e) {
    status = false
    msg = e.message
  }

  return res.json({
    status: status,
    msg: msg,
    coupon: coupon,
    product: product
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

module.exports = router;
