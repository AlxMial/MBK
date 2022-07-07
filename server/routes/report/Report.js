const express = require("express");
const router = express.Router();
const {
  tbMember,
  tbMemberPoint,
  tbPointCodeHD,
  tbPointCodeDT,
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbMemberReward,
  tbCouponCode,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.get("/ShowPointsHistory", validateToken, async (req, res) => {
  const listPointCodeHD = await tbPointCodeHD.findAll({
    where: { isDeleted: false },
    attributes: {
      include: [
        [
          Sequelize.fn("COUNT", Sequelize.col("tbpointcodedts.id")),
          "codeCount",
        ],
        [
          Sequelize.literal(`(
              SELECT COUNT(id)
              FROM tbMemberPoints
              WHERE
              tbMemberPoints.tbPointCodeHDId = tbPointCodeHD.id AND
              tbMemberPoints.isDeleted = 0
          )`),
          "useCount",
        ],
      ],
    },
    include: [
      {
        model: tbPointCodeDT,
        attributes: [],
      },
    ],
    group: ["tbPointCodeHD.id"],
  });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: listPointCodeHD,
  });
});

// router.get("/ShowCollectPoints", validateToken, async (req, res) => {
//   tbMember.hasMany(tbMemberPoint, { foreignKey: "id" });
//   tbMemberPoint.belongsTo(tbMember, { foreignKey: "tbMemberId" });
//   tbMemberPoint.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });

//   tbMemberPoint.findAll({
//     where: { isDeleted: false },
//     include: [
//       {
//         model: tbMember,
//         where: { isDeleted: false },
//         required: false,
//       },
//       {
//         model: tbPointCodeHD,
//         where: { isDeleted: false },
//         required: false,
//       },
//     ],
//   }).then((objs) => {
//     let tutorials = [];
//     objs.forEach((obj) => {
//       const tb_member =  obj.tbMember !== null ? obj.tbMember : null;
//       const tb_pointCodeHD =  obj.tbPointCodeHD !== null ? obj.tbPointCodeHD : null;
//       const fullname = tb_member !== null ? (Encrypt.DecodeKey(tb_member.firstName) + ' ' + Encrypt.DecodeKey(tb_member.lastName)) : "";
//       tutorials.push({
//           code: obj.code !== null ? Encrypt.DecodeKey(obj.code).toUpperCase() : "",
//           pointCodeName:  obj.campaignType === "3" ? "สมัครสมาชิก" : (tb_pointCodeHD !== null ? tb_pointCodeHD.pointCodeName : ""),
//           startDate:  (tb_pointCodeHD !== null) ? tb_pointCodeHD.startDate : "",
//           endDate:   (tb_pointCodeHD !== null) ? tb_pointCodeHD.endDate : "",
//           pointTypeId: obj.campaignType,
//           memberName: fullname,
//           phone   : (tb_member !== null ? Encrypt.DecodeKey(tb_member.phone) : ""),
//           point: obj.point,
//           exchangedate: obj.redeemDate,
//         });
//     });
//     res.json(tutorials);
//   });
// });

router.get("/ShowCollectPoints", validateToken, async (req, res) => {
  let status = true;
  let _points = [];
  let msg = "";
  try {
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

    tbMemberReward.belongsTo(tbMember, { foreignKey: "memberId" });
    //#region คูปอง

    const CouponData = await tbRedemptionConditionsHD.findAll({
      attributes: [
        ["redemptionName", "CampaignName"],
        "redemptionType",
        "rewardType",
        "points",
        "startDate",
        "endDate",
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
              attributes: ["codeCoupon"],
              model: tbCouponCode,
              where: {
                isDeleted: false,
              },
              required: true,
              include: [
                {
                  attributes: ["redeemDate", "memberId"],
                  model: tbMemberReward,
                  where: {
                    isDeleted: false,
                  },
                  required: true,
                  include: [
                    {
                      attributes: ["phone", "firstName", "lastName"],
                      model: tbMember,
                      where: {
                        isDeleted: false,
                      },
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (CouponData) {
      CouponData.map((e, i) => {
        const CampaignName = e.dataValues.CampaignName;
        const redemptionType =
          e.dataValues.redemptionType == 1 ? "Standard" : "Game";
        const rewardType =
          e.dataValues.rewardType == 1 ? "E-Coupon" : "Product";
        const points = e.dataValues.points;
        const startDate = e.dataValues.startDate;
        const endDate = e.dataValues.endDate;
        const campaignType =
          e.dataValues.redemptionType == 1
            ? e.dataValues.rewardType == 1
              ? 4
              : 5
            : 6;
        if (e.tbRedemptionCoupons.length > 0) {
          e.tbRedemptionCoupons.map((rc, rcii) => {
            const expiredDate = rc.dataValues.expiredDate;
            if (rc.tbCouponCodes.length > 0) {
              rc.tbCouponCodes.map((cc, cci) => {
                const codeCoupon = Encrypt.DecodeKey(
                  cc.codeCoupon
                ).toLocaleUpperCase();
                if (cc.tbMemberRewards) {
                  const redeemDate =
                    cc.tbMemberRewards[0].dataValues.redeemDate;
                  // const memberId = cc.tbMemberRewards[0].dataValues.memberId;
                  _points.push({
                    CampaignName: CampaignName,
                    campaignType: campaignType,
                    redemptionType: redemptionType,
                    rewardType: rewardType,
                    startDate: startDate,
                    endDate: endDate,
                    code: codeCoupon,
                    points: points,
                    redeemDate: redeemDate,
                    expiredDate: expiredDate,
                    ...Encrypt.decryptAllData(
                      cc.tbMemberRewards[0].dataValues.tbMember
                    ).dataValues,
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
        "startDate",
        "endDate",
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
              attributes: ["id", "memberId", "redeemDate"],
              model: tbMemberReward,
              where: {
                isDeleted: false,
              },
              required: true,
              include: [
                {
                  attributes: ["phone", "firstName", "lastName"],
                  model: tbMember,
                  where: {
                    isDeleted: false,
                  },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    if (productNameData) {
      productNameData.map((e, i) => {
        const CampaignName = e.dataValues.CampaignName;
        const redemptionType =
          e.dataValues.redemptionType == 1 ? "Standard" : "Game";
        const rewardType =
          e.dataValues.rewardType == 1 ? "E-Coupon" : "Product";
        const points = e.dataValues.points;
        const startDate = e.dataValues.startDate;
        const endDate = e.dataValues.endDate;
        const campaignType =
          e.dataValues.redemptionType == 1
            ? e.dataValues.rewardType == 1
              ? 4
              : 5
            : 6;
        if (e.tbRedemptionProducts) {
          const expiredDate = "";
          e.tbRedemptionProducts.map((rp, rpi) => {
            if (rp.tbMemberRewards) {
              const redeemDate = rp.tbMemberRewards[0].dataValues.redeemDate;
              const memberId = rp.tbMemberRewards[0].dataValues.memberId;
              _points.push({
                CampaignName: CampaignName,
                campaignType: campaignType,
                redemptionType: redemptionType,
                rewardType: rewardType,
                startDate: startDate,
                endDate: endDate,
                points: points,
                redeemDate: redeemDate,
                expiredDate: expiredDate,
                ...Encrypt.decryptAllData(
                  rp.tbMemberRewards[0].dataValues.tbMember
                ).dataValues,
              });
            }
          });
        }
      });
    }
    //#endregion สินค้า productName
    tbMemberPoint.belongsTo(tbMember, { foreignKey: "tbMemberId" });
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
      where: { campaignType: [1, 2, 3] },
      order: [["redeemDate", "DESC"]],
      include: [
        {
          attributes: ["phone", "firstName", "lastName"],
          model: tbMember,
          where: {
            isDeleted: false,
          },
          required: true,
        },
      ],
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
          _points.push({
            CampaignName: CampaignName,
            campaignType: campaignType,
            redemptionType: redemptionType,
            rewardType: rewardType,
            startDate: null,
            endDate: null,
            points: points,
            redeemDate: e.redeemDate,
            expiredDate: e.expireDate,
            ...Encrypt.decryptAllData(e.tbMember.dataValues).dataValues,
          });
        } else if (e.campaignType == 3) {
          let CampaignName = "ลงทะเบียน";
          let redemptionType = "Register";
          let rewardType = "";
          let points = e.point;
          let campaignType = e.campaignType;
          _points.push({
            CampaignName: CampaignName,
            campaignType: campaignType,
            redemptionType: redemptionType,
            rewardType: rewardType,
            startDate: null,
            endDate: null,
            points: points,
            redeemDate: e.redeemDate,
            expiredDate: e.expireDate,
            ...Encrypt.decryptAllData(e.tbMember.dataValues).dataValues,
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
                // memberId: id,
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

                _points.push({
                  CampaignName: CampaignName,
                  campaignType: campaignType,
                  redemptionType: redemptionType,
                  rewardType: rewardType,
                  startDate: null,
                  endDate: null,
                  points: item.dataValues.point,
                  redeemDate: item.dataValues.redeemDate,
                  expiredDate: item.dataValues.expireDate,
                  ...Encrypt.decryptAllData(item.tbMember.dataValues),
                });
              });
            }
          });
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
    points: _points,
  });
});

router.get("/ShowCampaignReward", validateToken, async (req, res) => {
  tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, {
    foreignKey: "redemptionConditionsHDId",
  });
  tbRedemptionProduct.belongsTo(tbRedemptionConditionsHD, {
    foreignKey: "redemptionConditionsHDId",
  });
  tbRedemptionCoupon.belongsTo(tbCouponCode, { foreignKey: "id" });
  const listMemberReward = await tbMemberReward.findAll({
    where: { isDeleted: false },
  });

  tbRedemptionConditionsHD
    .findAll({
      where: { isDeleted: false },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT SUM(couponCount)
              FROM tbredemptioncoupons tc
              WHERE
              tc.redemptionConditionsHDId = tbRedemptionConditionsHD.id AND
              tc.isDeleted = 0
          )`),
            "couponsCount",
          ],
          [
            Sequelize.literal(`(
              SELECT SUM(rewardCount)
              FROM tbredemptionproducts tp
              WHERE
              tp.redemptionConditionsHDId = tbRedemptionConditionsHD.id AND
              tp.isDeleted = 0
          )`),
            "productCount",
          ],
        ],
      },
      include: [
        {
          model: tbRedemptionProduct,
          where: { isDeleted: false },
          required: false,
        },
        {
          model: tbRedemptionCoupon,
          where: { isDeleted: false },
          required: false,
          include: [
            {
              model: tbCouponCode,
              where: { isDeleted: false, isUse: true },
              required: false,
            },
          ],
        },
      ],
    })
    .then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        let expiredDate = "";
        let exchangedTotal = 0;
        const rewardTotal =
          (obj.dataValues.couponsCount !== null
            ? parseInt(obj.dataValues.couponsCount, 10)
            : 0) +
          (obj.dataValues.productCount !== null
            ? parseInt(obj.dataValues.productCount, 10)
            : 0);
        // Products
        if (obj.tbRedemptionProducts.length > 0) {
          obj.tbRedemptionProducts.forEach((e) => {
            const m_reward = listMemberReward.find(
              (el) => el.TableHDId === e.id.toString()
            );
            if (m_reward !== undefined) {
              exchangedTotal += parseInt(e.rewardCount, 10);
            }
          });
        }
        // Coupons
        if (obj.tbRedemptionCoupons.length > 0) {
          obj.tbRedemptionCoupons.forEach((e) => {
            if (e.tbCouponCodes.length > 0) {
              e.tbCouponCodes.forEach((ele) => {
                const m_Coupon = listMemberReward.find(
                  (el) => el.TableHDId === ele.id.toString() && el.isUsedCoupon
                );
                if (m_Coupon !== undefined) {
                  exchangedTotal += parseInt(e.couponCount, 10);
                  expiredDate = e.expiredDate !== null ? e.expiredDate : "";
                }
              });
            }
          });
        }
        tutorials.push({
          redemptionName: obj.redemptionName,
          redemptionType: obj.redemptionType,
          rewardType: obj.rewardType,
          points: obj.points,
          startDate: obj.startDate,
          endDate: obj.endDate,
          expiredDate: expiredDate,
          point: obj.point,
          exchangedate: obj.redeemDate,
          rewardTotal: rewardTotal,
          exchangedTotal: exchangedTotal,
          toTal: rewardTotal - exchangedTotal,
        });
      });
      res.json(tutorials);
    });
});

router.get("/ShowCampaignExchange", validateToken, async (req, res) => {
  tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, {
    foreignKey: "redemptionConditionsHDId",
  });
  tbRedemptionProduct.belongsTo(tbRedemptionConditionsHD, {
    foreignKey: "redemptionConditionsHDId",
  });
  tbCouponCode.belongsTo(tbRedemptionCoupon, {
    foreignKey: "redemptionCouponId",
  });
  const listRedemptionConditionsHD = await tbRedemptionConditionsHD.findAll({
    where: { isDeleted: false },
  });
  const listCouponCode = await tbCouponCode.findAll({
    where: { isDeleted: false, isUse: true },
    include: [
      {
        model: tbRedemptionCoupon,
        where: { isDeleted: false },
        required: false,
        include: [
          {
            model: tbRedemptionConditionsHD,
            where: { isDeleted: false },
            required: false,
          },
        ],
      },
    ],
  });
  tbMemberReward.belongsTo(tbMember, { foreignKey: "memberId" });
  tbMemberReward
    .findAll({
      where: { isDeleted: false },
      include: [
        {
          model: tbMember,
          where: { isDeleted: false },
          required: false,
        },
      ],
    })
    .then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        const tb_member = obj.tbMember !== null ? obj.tbMember : null;
        let deliverStatus = "",
          trackingNo = "",
          code = "",
          status = "",
          isShowControl = false;
        let redemptionName = "",
          rewardType = "",
          redemptionType = "",
          points = "";
        const fullname =
          tb_member !== null
            ? Encrypt.DecodeKey(tb_member.firstName) +
              " " +
              Encrypt.DecodeKey(tb_member.lastName)
            : "";
        const address =
          tb_member !== null ? Encrypt.DecodeKey(tb_member.address) : "";
        let startDate = "";
        let endDate = "";
        if (obj.rewardType === "Coupon") {
          const lCouponCode = listCouponCode.filter(
            (e) => e.id.toString() === obj.TableHDId
          );
          if (lCouponCode.length > 0) {
            const rdCupon = lCouponCode[0].tbRedemptionCoupon;
            status =
              rdCupon !== null && !rdCupon.iscancel && lCouponCode[0].isUse
                ? 1
                : 0;
            code = Encrypt.DecodeKey(lCouponCode[0].codeCoupon);
            if (rdCupon !== null && rdCupon.tbRedemptionConditionsHD !== null) {
              redemptionName = rdCupon.tbRedemptionConditionsHD.redemptionName;
              redemptionType = rdCupon.tbRedemptionConditionsHD.redemptionType;
              rewardType = rdCupon.tbRedemptionConditionsHD.rewardType;
              points = rdCupon.tbRedemptionConditionsHD.points;
              startDate = rdCupon.tbRedemptionConditionsHD.startDate;
              endDate = rdCupon.tbRedemptionConditionsHD.endDate;
            }
          }
        } else {
          const lRedemptionProduct = listRedemptionConditionsHD.filter(
            (e) => e.id.toString() === obj.TableHDId
          );
          if (lRedemptionProduct.length > 0) {
            const rwHD = lRedemptionProduct[0];
            deliverStatus = obj.deliverStatus;
            trackingNo = obj.trackingNo;
            status = 1;
            isShowControl = rwHD.rewardType === "1" ? false : true;
            if (rwHD !== null) {
              redemptionName = rwHD.redemptionName;
              redemptionType = rwHD.redemptionType;
              rewardType = rwHD.rewardType;
              points = rwHD.points;
              startDate = rwHD.startDate;
              endDate = rwHD.endDate;
            }
          }
        }
        tutorials.push({
          id: Encrypt.EncodeKey(obj.id),
          code: code,
          redemptionName: redemptionName,
          redemptionType: redemptionType,
          rewardType: rewardType,
          startDate: startDate,
          endDate: endDate,
          firstName: tb_member !== null ? tb_member.firstName : 0,
          lastName: tb_member !== null ? tb_member.lastName : 0,
          memberName: fullname,
          address: isShowControl ? address : "",
          subDistrict:
            tb_member !== null && isShowControl ? tb_member.subDistrict : 0,
          district:
            tb_member !== null && isShowControl ? tb_member.district : 0,
          postcode:
            tb_member !== null && isShowControl ? tb_member.postcode : 0,
          province:
            tb_member !== null && isShowControl ? tb_member.province : 0,
          phone:
            tb_member !== null && isShowControl
              ? Encrypt.DecodeKey(tb_member.phone)
              : "",
          deliverStatus: deliverStatus,
          trackingNo: trackingNo,
          points: points,
          redeemDate: obj.redeemDate,
          isShowControl: isShowControl,
          isShowTKNo: false,
          status: status,
        });
      });
      res.json(tutorials);
    });
});

router.get("/exportExcel/:id", validateToken, async (req, res) => {
  tbPointCodeDT.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });
  tbMemberPoint.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });
  tbMemberPoint.belongsTo(tbMember, { foreignKey: "tbMemberId" });
  const id = parseInt(req.params.id, 10);
  tbPointCodeDT
    .findAll({
      where: { tbPointCodeHDId: id, isDeleted: false },
      required: false,
      include: [
        {
          model: tbPointCodeHD,
          where: { isDeleted: false, id: id },
          required: false,
          include: [
            {
              model: tbMemberPoint,
              where: { isDeleted: false, tbPointCodeHDId: id },
              required: false,
              include: [
                {
                  model: tbMember,
                  where: { isDeleted: false },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    })
    .then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        let fullname = "";
        let redeemDate = "";
        const code = Encrypt.DecodeKey(obj.code).toUpperCase();
        if (obj.tbPointCodeHD.tbMemberPoints.length > 0) {
          Encrypt.decodePointCode(obj.tbPointCodeHD.tbMemberPoints);
          tbMemberPoints = obj.tbPointCodeHD.tbMemberPoints.find(
            (el) => el.code.toUpperCase() === code
          );
          if (tbMemberPoints !== undefined) {
            redeemDate = tbMemberPoints.redeemDate;
            if (tbMemberPoints.tbMember !== undefined) {
              const memeber = Encrypt.decryptAllData(tbMemberPoints.tbMember);
              fullname = memeber.firstName + " " + memeber.lastName;
            }
          }
        }
        tutorials.push({
          code: Encrypt.DecodeKey(obj.code).toUpperCase(),
          isUse: obj.isUse ? "ใช้งาน" : "ยังไม่ได้ใช้งาน",
          isExpire: obj.isExpire ? "หมดอายุ" : "ยังไม่หมดอายุ",
          memberName: fullname,
          dateUseCode: redeemDate,
        });
      });
      res.json(tutorials);
    });
});

// ค้นหา code ก่อน
router.get("/GetPoint", validateToken, async (req, res) => {
  const lisltbPointCodeHD = await tbPointCodeHD.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: lisltbPointCodeHD,
  });
});

// ค้นหา code ก่อน
router.get("/GetPointDT/:id", validateToken, async (req, res) => {
  tbMemberPoint.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });
  tbMemberPoint.belongsTo(tbMember, { foreignKey: "tbMemberId" });
  tbPointCodeDT.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });
  const id = req.params.id;
  let count = 0;
  tbPointCodeHD
    .findAll({
      where: {
        isDeleted: false,
        id: id,
      },
      include: [
        {
          model: tbMemberPoint,
          where: { isDeleted: false },
          include: [
            {
              model: tbMember,
              where: { isDeleted: false },
            },
          ],
        },
        {
          model: tbPointCodeDT,
          where: { isDeleted: false },
          //required: false,
        },
      ],
    })
    .then((objs) => {
      if (objs.length === 1) {
        let tutorials = [];
        objs.forEach((obj) => {
          obj.tbMemberPoints.forEach((el) => {
            el.tbMember = Encrypt.decryptAllData(el.tbMember);
          });

          tutorials.push({
            pointCodeName: obj.pointCodeName,
            startDate: obj.startDate,
            endDate: obj.endDate,
            tbMemberPoint: Encrypt.decodePointCode(obj.tbMemberPoints),
            tbPointCodeDT: Encrypt.decodePointCode(obj.tbPointCodeDTs),
            isType: obj.isType,
            pointCodePoint: obj.pointCodePoint,
          });
        });
        res.json(tutorials);
      } else {
        res.json({
          status: false,
          message: "failed",
        });
      }
    });
});

router.post("/doSaveUpdateMemberReward", validateToken, async (req, res) => {
  let data = req.body;
  const uptbMemberReward = await tbMemberReward.update(
    {
      trackingNo: data.trackingNo,
      deliverStatus: data.deliverStatus,
    },
    { where: { id: Encrypt.DecodeKey(data.id) } }
  );
  res.json({
    status: true,
    message: "success",
    tbStock: uptbMemberReward,
  });
});
module.exports = router;
