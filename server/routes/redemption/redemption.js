const express = require("express");
const router = express.Router();
const {
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const Op = Sequelize.Op;
const Encrypt = new ValidateEncrypt();

router.get("/", validateToken, async (req, res) => {
  const listRedemption = await tbRedemptionConditionsHD.findAll({
    where: { isDeleted: false },
  });
  if (listRedemption.length > 0) {
    const valueData = Encrypt.decryptAllDataArray(listRedemption);
    Encrypt.encryptValueIdArray(valueData);
    res.json({ status: true, message: "success", tbUser: valueData });
  } else res.json({ status: false, message: "not found user", tbUser: null });
});

router.post("/", validateToken, async (req, res) => {
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.create(req.body);
    console.log(redemption)
    if (redemption) {
      if (redemption.rewardType === "1") {
        const coupon = await tbRedemptionCoupon.create(req.body.coupon);
      } else if (redemption.rewardType === "2") {
        const product = await tbRedemptionProduct.create(req.body.product);
      }
      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
      });
    }
  } else {
    if (RedemptionConditionsHD.redemptionName === req.body.redemptionName) {
      res.json({
        status: false,
        isError: false,
        isRedemptionName: true,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
      });
    }
  }
});

module.exports = router;