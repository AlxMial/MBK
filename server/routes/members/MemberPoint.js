const express = require("express");
const router = express.Router();
const { tbMemberPoint, tbPointCodeHD, tbPointCodeDT,tbMemberReward,tbCouponCode,tbRedemptionProduct } = require("../../models");
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
        [Op.ne]: [4,5,6]
      },
      tbMemberId: memberId,
    },
    include: [
      {
        model: tbPointCodeHD,
        attributes: ["pointCodeName"],
        where: { isDeleted: false },
        required: false
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
    where: { isDeleted: false,memberId:memberId },

  });
  if (listRedemption.length > 0) {
    res.json({
      status: true,
      message: "success",
      tbRedemption: listRedemption,
    });
  } else res.json({ error: "not found redeem" });
});

module.exports = router;
