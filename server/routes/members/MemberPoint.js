const express = require("express");
const router = express.Router();
const {
  tbMemberPoint,
  tbPointCodeHD,
  tbPointCodeDT,
  tbMemberReward,
  tbCouponCode,
  tbRedemptionProduct,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.get("/reward/:memberId", async (req, res) => {
  const memberId = Encrypt.DecodeKey(req.params.memberId);

  tbPointCodeHD.hasMany(tbMemberPoint, { foreignKey: "id" });
  tbMemberPoint.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });

  const listMemberPoint = await tbMemberPoint.findAll({
    where: {
      isDeleted: false,
      campaignType: {
        [Op.ne]: [4, 5, 6],
      },
      tbMemberId: memberId,
    },
    include: [
      {
        model: tbPointCodeHD,
        attributes: ["pointCodeName"],
        where: { isDeleted: false },
        required: false,
      },
    ],
    group: ["tbMemberPoint.id"],
  });

  Encrypt.decodePointCode(listMemberPoint);

  if (listMemberPoint.length > 0) {
    res.json({ status: true, message: "success", tbReward: listMemberPoint });
  } else res.json({ error: "not found redeem" });
});

router.get("/redemption/:memberId", validateToken, async (req, res) => {
  const memberId = Encrypt.DecodeKey(req.params.memberId);

  const listRedemption = await tbMemberReward.findAll({
    where: { isDeleted: false, memberId: memberId },
  });
  if (listRedemption.length > 0) {
    res.json({
      status: true,
      message: "success",
      tbRedemption: listRedemption,
    });
  } else res.json({ error: "not found redeem" });
});

router.get("/memberPointExpire", async (req, res) => {
  let status = true;
  let msg = "";
  const memberId = 109
  let currentYear = new Date().getFullYear();
  let ExpireYear = 2022;
  if (currentYear % 2 == 0) {
    ExpireYear = currentYear;
  } else {
    ExpireYear = currentYear + 1;
  }
  let sumAllPoint;
  let sumUsePoint;
  let expirePoint;
  try {
    //sum all point
    const sumPoint = await tbMemberPoint.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.cast(Sequelize.col("point"), "integer")
          ),
          "sumPoint",
        ],
      ],
      where: { tbMemberId: memberId },
    });
    const sumPointuse = await tbMemberPoint.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.cast(Sequelize.col("point"), "integer")
          ),
          "sumPoint",
        ],
      ],
      where: { campaignType: [4, 5, 6] , tbMemberId: memberId},
    });
    const sumPointExpire = await tbMemberPoint.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.cast(Sequelize.col("point"), "integer")
          ),
          "sumPoint",
        ],
      ],
      where: {
        campaignType: [1, 2, 3],
        expireDate: { [Op.lte]: new Date(ExpireYear + "-12-31") },
        tbMemberId: memberId
      },
    });
    if (sumPoint) {
      sumAllPoint = parseInt(sumPoint.dataValues.sumPoint || 0);
    }
    if (sumPointuse) {
      sumUsePoint = parseInt(sumPointuse.dataValues.sumPoint || 0);
    }
    if (sumPointExpire) {
      expirePoint = parseInt(sumPointExpire.dataValues.sumPoint || 0);
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  res.json({
    status: status,
    msg: msg,
    currentYear: currentYear,
    ExpireYear: new Date(ExpireYear + "-12-31"),
    sumAllPoint: sumAllPoint,
    sumPointuse: sumUsePoint,
    expirePoint: expirePoint,
  });
});

module.exports = router;
