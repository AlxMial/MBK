const express = require("express");
const router = express.Router();
const { tbRedemptionConditionsHD,tbRedemptionCoupon,tbRedemptionProduct } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const Op = Sequelize.Op;
const Encrypt = new ValidateEncrypt();

router.get("/",validateToken, async (req, res) => {
    const listRedemption = await tbRedemptionConditionsHD.findAll({ where: { isDeleted: false } });
    if (listRedemption.length > 0) {
      const valueData = Encrypt.decryptAllDataArray(listRedemption);
      Encrypt.encryptValueIdArray(valueData);
      res.json({ status: true, message: "success", tbUser: valueData });
    } else
      res.json({ status: false, message: "not found user", tbUser: null });
  });