const express = require("express");
const router = express.Router();
const {
  tbMember,
  tbMemberPoint,
  tbPointCodeHD,
  tbPointCodeDT,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const decodeCoupon = require("../../services/decryptCoupon");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", async (req, res) => {
  const decode = new decodeCoupon();
  let redeemCode = req.body.redeemCode;
  try {
    for (var x = 0; x < redeemCode.length; x++) {
      const splitValue = redeemCode[x].split("-");
      if (splitValue.length > 1) {
        redeemCode[x] = Encrypt.EncodeKey(
          splitValue[0] + "-" + splitValue[1].toLowerCase()
        );
      } 
    }


    let statusRedeem = [];
    let status;
    for (var i = 0; i < redeemCode.length; i++) {
      const PointDt = await tbPointCodeDT.findOne({
        where: { code: redeemCode[i].toLowerCase(),isDeleted:false },
      });
      const Point = await tbPointCodeHD.findOne({
        where : { isActive:'1',isDeleted:false },
        include: { model: tbPointCodeDT, where: { code: redeemCode[i].toLowerCase(),isDeleted:false} },
      });
      
      if (PointDt && Point) {
        if (PointDt.dataValues.isExpire) {
          status = {
            coupon:  Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
            isValid: false,
            isInvalid: false,
            isExpire: true,
            isUse: false,
          };
        } else if (PointDt.dataValues.isUse) {
          status = {
            coupon:  Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
            isValid: false,
            isInvalid: false,
            isExpire: false,
            isUse: true,
          };
        } else {
          if (Point) {
            if (Point.dataValues.isType === "1") {
              var isMatch = decode.decryptCoupon(
                Encrypt.DecodeKey(redeemCode[i]),
                Encrypt.DecodeKey(redeemCode[i]).length
              );
              if (isMatch) {
                status = {
                  coupon:  Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
                  isValid: true,
                  isInvalid: false,
                  isExpire: false,
                  isUse: false,
                };
              } else {
                status = {
                  coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
                  isValid: false,
                  isInvalid: true,
                  isExpire: false,
                  isUse: false,
                };
              }
            } else if (Point.dataValues.isType === "2") {
              status = {
                coupon:  Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
                isValid: true,
                isInvalid: false,
                isExpire: false,
                isUse: false,
              };
            }
          }
        }

        if (status.isValid) {
          PointDt.dataValues.isUse = true;
          PointDt.dataValues.memberId = req.body.memberId;
          const updatePointCode = await tbPointCodeDT.update(
            PointDt.dataValues,
            {
              where: { id: PointDt.dataValues.id },
            }
          );
          let historyPoint = {
            campaignType: Point.dataValues.isType == "1" ? 1 : 2,
            code: redeemCode[i],
            point: Point.dataValues.pointCodePoint,
            redeemDate: new Date(),
            expireDate: new Date(new Date().getFullYear() + 2, 11, 32),
            isDeleted: false,
            tbMemberId: req.body.memberId,
            tbPointCodeHDId: Point.dataValues.id,
          };
          const memberPoint = await tbMemberPoint.create(historyPoint);

          const member = await tbMember.findOne({
            where: { id: req.body.memberId },
          });

          member.dataValues.memberPointExpire = new Date(
            new Date().getFullYear() + 2,
            11,
            32
          );
          member.dataValues.memberPoint =
            member.dataValues.memberPoint + Point.dataValues.pointCodePoint;

          const updateMember = await tbMember.update(member.dataValues, {
            where: { id: member.dataValues.id },
          });
        }
      } else {
        status = {
          coupon:  Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
          isValid: false,
          isInvalid: true,
          isExpire: false,
          isUse: false,
        };
      }
      statusRedeem.push(status);
    }
    return res.status(200).json({ data: statusRedeem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
