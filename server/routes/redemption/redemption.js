const express = require("express");
const router = express.Router();
const {
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbImage,
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
    Encrypt.encryptValueIdArray(listRedemption);
    res.json({
      status: true,
      message: "success",
      tbRedemptionConditionsHD: listRedemption,
    });
  } else
    res.json({
      status: false,
      message: "not found user",
      tbRedemptionConditionsHD: null,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = Encrypt.DecodeKey(req.params.id);
    const listRedemption = await tbRedemptionConditionsHD.findOne({
      where: { id: id },
    });
    let Image = {};
    const listCoupon = await tbRedemptionCoupon.findOne({
      where: { redemptionConditionsHdId: id },
    });
    const listProduct = await tbRedemptionProduct.findOne({
      where: { redemptionConditionsHdId: id },
    });

    if (listCoupon) {
      Image = await tbImage.findOne({
        where : { relatedId: listCoupon.dataValues.id }
      });
    } else if (listProduct) {
      Image = await tbImage.findOne({
        where : { relatedId: listProduct.dataValues.id }
      });
    }
    if (listRedemption) {
      Encrypt.encryptValueId(listRedemption);
      res.json({
        status: true,
        message: "success",
        tbRedemptionConditionsHD: listRedemption,
        tbRedemptionCoupon: listCoupon,
        tbRedemptionProduct: listProduct,
        tbImage:Image
      });
    }else{
      res.json({
        status: false,
        message: "not found",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
        tbImage:null
      });
    }
  } else {
    res.json({
      status: true,
      message: "success",
      tbRedemptionConditionsHD: null,
      tbRedemptionCoupon: null,
      tbRedemptionProduct: null,
    });
  }
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
    if (redemption) {

      let coupon = null;
      let product = null;
      if (redemption.rewardType === "1") {
        req.body.coupon.expiredDate = (req.body.coupon.isNotExpired) ? null : req.body.coupon.expiredDate ;
        req.body.coupon["redemptionConditionsHDId"] = redemption.dataValues.id;
        coupon = await tbRedemptionCoupon.create(req.body.coupon);
      } else if (redemption.rewardType === "2") {
        req.body.product.isNoLimitReward = (req.body.product.isNoLimitReward) ? null : req.body.product.rewardCount ;
        req.body.product["redemptionConditionsHDId"] = redemption.dataValues.id;
        product = await tbRedemptionProduct.create(req.body.product);
      }
      Encrypt.encryptValueId(redemption);
      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
        tbRedemptionCoupon: coupon,
        tbRedemptionProduct: product,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
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
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});


router.put("/", validateToken, async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.update(req.body, {
      where: { id: req.body.id },
    });
    if (redemption) {
      let coupon = null;
      let product = null;
      if (req.body.rewardType === "1") {
        req.body.coupon.expiredDate = (req.body.coupon.isNotExpired) ? null : req.body.coupon.expiredDate ;
        coupon = await tbRedemptionCoupon.update(req.body.coupon, {
          where: { id: req.body.coupon.id },
        });

      } else if (req.body.rewardType === "2") {
        req.body.product.rewardCount = (req.body.product.isNoLimitReward) ? null : req.body.product.rewardCount ;
        product = await tbRedemptionProduct.update(req.body.product, {
          where: { id: req.body.product.id },
        });
      }
      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
        tbRedemptionCoupon: coupon,
        tbRedemptionProduct: product,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
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
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});

module.exports = router;
