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

router.post("/", async (req, res) => {
  const decode = new decodeCoupon();
  let redeemCode = req.body.redeemCode;
  try {
    let statusRedeem = [];
    let status;
    for (var i = 0; i < redeemCode.length; i++) {
      const PointDt = await tbPointCodeDT.findOne({
        where: { code: redeemCode[i].toLowerCase(),isDeleted:false },
      });
      const Point = await tbPointCodeHD.findOne({
        include: { model: tbPointCodeDT, where: { code: redeemCode[i].toLowerCase(),isDeleted:false } },
      });
      if (PointDt) {
        if (PointDt.dataValues.isExpire) {
          status = {
            coupon: redeemCode[i],
            isValid: false,
            isInvalid: false,
            isExpire: true,
            isUse: false,
          };
        } else if (PointDt.dataValues.isUse) {
          status = {
            coupon: redeemCode[i],
            isValid: false,
            isInvalid: false,
            isExpire: false,
            isUse: true,
          };
        } else {
          if (Point) {
            if (Point.dataValues.isType === "1") {
              var isMatch = decode.decryptCoupon(
                redeemCode[i].toLowerCase(),
                redeemCode[i].length
              );
              console.log(isMatch)
              if (isMatch) {
                status = {
                  coupon: redeemCode[i],
                  isValid: true,
                  isInvalid: false,
                  isExpire: false,
                  isUse: false,
                };
              } else {
                status = {
                  coupon: redeemCode[i],
                  isValid: false,
                  isInvalid: true,
                  isExpire: false,
                  isUse: false,
                };
              }
            } else if (Point.dataValues.isType === "2") {
              status = {
                coupon: redeemCode[i],
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
          coupon: redeemCode[i],
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
