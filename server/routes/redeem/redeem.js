const express = require("express");
const router = express.Router();
const {
  tbMember,
  tbMemberPoint,
  tbPointCodeHD,
  tbPointCodeDT,
  tbRedemptionConditionsHD,
  tbRedemptionProduct,
  tbRedemptionCoupon
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const decodeCoupon = require("../../services/decryptCoupon");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/lowLevel", async (req, res) => {

  const PointDt = await tbPointCodeDT.findAll();
  for (var i = 0; i < PointDt.length; i++) {
    const de = Encrypt.DecodeKey(PointDt[i].dataValues.code);
    const lowde = de.toLowerCase();

    const updatelow = await tbPointCodeDT.update({ code: Encrypt.EncodeKey(lowde) }, {
      where: { id: PointDt[i].dataValues.id },
    });
    console.log("update Success  = " + i);
  }

});


router.post("/", async (req, res) => {
  const decode = new decodeCoupon();
  let redeemCode = req.body.redeemCode;
  req.body.memberId = Encrypt.DecodeKey(req.body.memberId);
  try {
    let statusRedeem = [];
    let status;
    for (var x = 0; x < redeemCode.length; x++) {
      redeemCode[x] = Encrypt.EncodeKey(redeemCode[x].toLowerCase());
      // try {
      //   const splitValue = redeemCode[x].split("-");
      //   if (splitValue.length > 1) {
      //     redeemCode[x] = Encrypt.EncodeKey(
      //       splitValue[0] + "-" + splitValue[1].toLowerCase()
      //     );
      //   }
      // } catch {
      //   status = {
      //     coupon: redeemCode[x],
      //     isValid: false,
      //     isInvalid: false,
      //     isExpire: true,
      //     isUse: false,
      //   };
      //   statusRedeem.push(status);
      // }
    }

    for (var i = 0; i < redeemCode.length; i++) {
      const PointDt = await tbPointCodeDT.findOne({
        where: { code: redeemCode[i], isDeleted: false },
      });

      const Point = await tbPointCodeHD.findOne({
        where: { isActive: "1", isDeleted: false },
        include: {
          model: tbPointCodeDT,
          where: { code: redeemCode[i], isDeleted: false },
        },
      });

      if (PointDt && Point) {
        if (PointDt.dataValues.isExpire) {
          status = {
            coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
            isValid: false,
            isInvalid: false,
            isExpire: true,
            isUse: false,
          };
        } else if (PointDt.dataValues.isUse) {
          status = {
            coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
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
                  coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
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
                coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
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
          coupon: Encrypt.DecodeKey(redeemCode[i]).toLocaleUpperCase(),
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
    res.status(500).json({
      message: {
        coupon: err.message,
        isValid: false,
        isInvalid: true,
        isExpire: false,
        isUse: false,
      },
    });
  }
});

router.get("/getRedemptionconditionshd", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let RedemptionConditionsHD = []
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      let _RedemptionConditionsHD = await tbRedemptionConditionsHD.findAll({
        attributes: [
          "id",
          "redemptionName",
          "redemptionType",
          "rewardType",
          "points",
          "startDate",
          "endDate",
        ],
        where: {
          isDeleted: false,
        },
      });
      if (_RedemptionConditionsHD) {
        let item = _RedemptionConditionsHD
        for (var i = 0; i < item.length; i++) {
          if (new Date() >= item[i].startDate && new Date() <= item[i].endDate) {
            if (item[i].redemptionType == 1) {
              if (item[i].rewardType == 1) {

                const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
                  attributes: ["id"],
                  where: { redemptionConditionsHDId: item[i].id },
                });

                item[i].dataValues.redemptionId = Encrypt.EncodeKey(_tbRedemptionCoupon.dataValues.id)
                item[i].dataValues.id = Encrypt.EncodeKey(item[i].dataValues.id)
                RedemptionConditionsHD.push(item[i])
              } else {
                const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
                  attributes: ["id"],
                  where: { redemptionConditionsHDId: item[i].id },
                });
                item[i].dataValues.redemptionId = Encrypt.EncodeKey(_tbRedemptionProduct.dataValues.id)
                item[i].dataValues.id = Encrypt.EncodeKey(item[i].dataValues.id)
                RedemptionConditionsHD.push(item[i])
              }
            } else {
              item[i].dataValues.id = Encrypt.EncodeKey(item[i].dataValues.id)
              RedemptionConditionsHD.push(item[i])
            }
          }
        }
      }

    }
  } catch (e) {
    status = false
    msg = e.message
  }

  res.json({
    status: true,
    message: msg,
    Redemptionconditionshd: RedemptionConditionsHD,
  });
});

router.post("/getRedemptionconditionshdById", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let RedemptionConditionsHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const RedemptionConditionsHDId = Encrypt.DecodeKey(req.body.Id);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      let _RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
        attributes: [
          "id",
          "redemptionName",
          "redemptionType",
          "rewardType",
          "points",
          "startDate",
          "endDate",
          "description"
        ],
        where: {
          isDeleted: false,
          id: RedemptionConditionsHDId
        },
      });
      if (_RedemptionConditionsHD) {
        let item = _RedemptionConditionsHD.dataValues

        if (item.redemptionType == 1) {
          if (item.rewardType == 1) {

            const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
              attributes: ["id"],
              where: { redemptionConditionsHDId: item.id },
            });

            item.redemptionId = Encrypt.EncodeKey(_tbRedemptionCoupon.dataValues.id)
            item.id = Encrypt.EncodeKey(item.id)
            RedemptionConditionsHD = item
          } else {
            const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
              attributes: ["id"],
              where: { redemptionConditionsHDId: item.id },
            });
            item.redemptionId = Encrypt.EncodeKey(_tbRedemptionProduct.dataValues.id)
            item.id = Encrypt.EncodeKey(item.id)
            RedemptionConditionsHD = item
          }
        } else {
          item.id = Encrypt.EncodeKey(item.id)
          RedemptionConditionsHD = item
        }
      }

    }
  } catch (e) {
    status = false
    msg = e.message
  }

  res.json({
    status: true,
    message: msg,
    Redemptionconditionshd: RedemptionConditionsHD,
  });
});


module.exports = router;
