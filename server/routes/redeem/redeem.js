const express = require("express");
const router = express.Router();
const {
  tbMember,
  tbMemberPoint,
  tbPointCodeHD,
  tbPointCodeDT,
  tbRedemptionConditionsHD,
  tbRedemptionProduct,
  tbRedemptionCoupon,
  tbCouponCode,
  tbMemberReward,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const decodeCoupon = require("../../services/decryptCoupon");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const e = require("express");
const Encrypt = new ValidateEncrypt();

router.post("/lowLevel", async (req, res) => {
  const PointDt = await tbPointCodeDT.findAll({
    where: { tbPointCodeHDId: req.body.id },
  });
  for (var i = 0; i < PointDt.length; i++) {
    const de = Encrypt.DecodeKey(PointDt[i].dataValues.code);
    const lowde = de.toLowerCase().replace("-", "");

    const updatelow = await tbPointCodeDT.update(
      { codeNone: Encrypt.EncodeKey(lowde) },
      {
        where: { id: PointDt[i].dataValues.id },
      }
    );
    console.log("update Success  = " + i + " / " + PointDt.length);
  }
});

router.post("/", validateLineToken, async (req, res) => {
  const decode = new decodeCoupon();
  let redeemCode = req.body.redeemCode;
  req.body.memberId = Encrypt.DecodeKey(req.body.memberId);
  try {
    let statusRedeem = [];
    let status;

    let _redeemCode = [];
    redeemCode.filter((e) => {
      _redeemCode.push(Encrypt.EncodeKey(e.toLowerCase()));
    });
    tbPointCodeHD.hasMany(tbPointCodeDT, {
      foreignKey: "tbPointCodeHDId",
    });
    const productNameData = await tbPointCodeHD.findAll({
      attributes: ["id", "pointCodePoint", "endDate", "isActive"],
      where: {
        isDeleted: false,
      },
      order: [["id", "DESC"]],
      include: [
        {
          attributes: [
            "id",
            "code",
            "codeNone",
            "isUse",
            "isExpire",
            "isDeleted",
            "tbPointCodeHDId",

          ],

          model: tbPointCodeDT,
          where: {
            [Op.or]: [{ code: _redeemCode }, { codeNone: _redeemCode }],
          },
          order: [["id", "DESC"]],
        },
      ],
      required: false,
    });

    // มีโคด
    // let status = [];
    if (productNameData) {
      for (var x = 0; x < productNameData.length; x++) {
        let hd = productNameData[x].dataValues;
        for (
          var i = 0;
          i < productNameData[x].dataValues.tbPointCodeDTs.length;
          i++
        ) {
          let dt = productNameData[x].dataValues.tbPointCodeDTs[i].dataValues;
          if (
            new Date(new Date(hd.endDate).setUTCHours(0, 0, 0, 0)) <
            new Date(new Date().setUTCHours(0, 0, 0, 0)) ||
            !productNameData[x].dataValues.isActive
          ) {
            status = {
              coupon: Encrypt.DecodeKey(
                _redeemCode.find((e) => e == dt.code || e == dt.codeNone)
              ),
              isValid: false,
              isInvalid: false,
              isExpire: true,
              isUse: false,
              isDuplicate: false,
            };
          } else if (dt.isUse) {
            status = {
              coupon: Encrypt.DecodeKey(
                _redeemCode.find((e) => e == dt.code || e == dt.codeNone)
              ),

              isValid: false,
              isInvalid: false,
              isExpire: false,
              isUse: true,
              isDuplicate: false,
            };
          } else {
            status = {
              coupon: Encrypt.DecodeKey(
                _redeemCode.find((e) => e == dt.code || e == dt.codeNone)
              ),
              isValid: true,
              isInvalid: false,
              isExpire: false,
              isUse: false,
              isDuplicate: false,
            };
          }

          if (status.isValid) {
            dt.isUse = true;
            dt.memberId = req.body.memberId;
            const updatePointCode = await tbPointCodeDT.update(
              { isUse: true, memberId: req.body.memberId },
              {
                where: { id: dt.id },
              }
            );
            let code = _redeemCode.find(
              (e) => e == dt.code || e == dt.codeNone
            );
            let historyPoint = {
              campaignType: "1",
              code: code,
              point: hd.pointCodePoint,
              redeemDate: new Date(),
              expireDate: new Date(new Date().getFullYear() + 2, 11, 31),
              isDeleted: false,
              tbMemberId: req.body.memberId,
              tbPointCodeHDId: dt.tbPointCodeHDId,
              pointsStoreHdId: Encrypt.DecodeKey(req.body.storeId),
              pointsStoreDtId: (req.body.branchId) ? Encrypt.DecodeKey(req.body.branchId) : null
            };

            const memberPoint = await tbMemberPoint.create(historyPoint);

            const member = await tbMember.findOne({
              where: { id: req.body.memberId },
            });

            member.dataValues.memberPoint =
              member.dataValues.memberPoint + hd.pointCodePoint;

            const updateMember = await tbMember.update(member.dataValues, {
              where: { id: member.dataValues.id },
            });
          }
          statusRedeem.push(status);
        }
      }
    } else {
      //ไม่มีเลย
      _redeemCode.map((e, i) => {
        status = {
          coupon: Encrypt.DecodeKey(e),
          isValid: false,
          isInvalid: true,
          isExpire: false,
          isUse: false,
          isDuplicate: false,
        };
        statusRedeem.push(status);
      });
    }
    if (statusRedeem.length != _redeemCode.length) {
      _redeemCode.map((e, i) => {
        let code = Encrypt.DecodeKey(e);
        let find = statusRedeem.find((e) => e.coupon == code);
        if (find == null) {
          status = {
            coupon: code,
            isValid: false,
            isInvalid: true,
            isExpire: false,
            isUse: false,
            isDuplicate: false,
          };
          statusRedeem.push(status);
        }
      });
    }
    // for (var x = 0; x < redeemCode.length; x++) {
    //   // redeemCode[x] = ;
    //   // try {
    //   //   const splitValue = redeemCode[x].split("-");
    //   //   if (splitValue.length > 1) {
    //   //     redeemCode[x] = Encrypt.EncodeKey(
    //   //       splitValue[0] + "-" + splitValue[1].toLowerCase()
    //   //     );
    //   //   }
    //   // } catch {
    //   //   status = {
    //   //     coupon: redeemCode[x],
    //   //     isValid: false,
    //   //     isInvalid: false,
    //   //     isExpire: true,
    //   //     isUse: false,
    //   //   };
    //   //   statusRedeem.push(status);
    //   // }
    //   const PointDt = await tbPointCodeDT.findOne({
    //     attributes: [
    //       "id",
    //       "code",
    //       "codeNone",
    //       "isUse",
    //       "isExpire",
    //       "isDeleted",
    //       "tbPointCodeHDId",
    //     ],
    //     where: {
    //       [Op.or]: [
    //         { code: Encrypt.EncodeKey(redeemCode[x].toLowerCase()) },
    //         { codeNone: Encrypt.EncodeKey(redeemCode[x].toLowerCase()) },
    //       ],
    //       isDeleted: false,
    //     },
    //   });

    //   let Point = [];
    //   if (PointDt) {
    //     try {
    //       Point = await tbPointCodeHD.findOne({
    //         attributes: ["id", "pointCodePoint"],
    //         where: {
    //           id: PointDt.dataValues.tbPointCodeHDId,
    //           isDeleted: false,
    //         },
    //       });
    //     } catch (err) {
    //       console.log(err.message);
    //     }
    //   }

    //   if (PointDt && Point) {
    //     if (PointDt.dataValues.isExpire) {
    //       status = {
    //         coupon: redeemCode[x],
    //         isValid: false,
    //         isInvalid: false,
    //         isExpire: true,
    //         isUse: false,
    //       };
    //     } else if (PointDt.dataValues.isUse) {
    //       status = {
    //         coupon: redeemCode[x],
    //         isValid: false,
    //         isInvalid: false,
    //         isExpire: false,
    //         isUse: true,
    //       };
    //     } else {
    //       status = {
    //         coupon: redeemCode[x],
    //         isValid: true,
    //         isInvalid: false,
    //         isExpire: false,
    //         isUse: false,
    //       };
    //     }

    //     if (status.isValid) {
    //       PointDt.dataValues.isUse = true;
    //       PointDt.dataValues.memberId = req.body.memberId;

    //       // const updatePointCode = await tbPointCodeDT.update(
    //       //   PointDt.dataValues,
    //       //   {
    //       //     where: { id: PointDt.dataValues.id },
    //       //   }
    //       // );

    //       let historyPoint = {
    //         campaignType: "1",
    //         code: Encrypt.EncodeKey(redeemCode[x].toLowerCase()),
    //         point: Point.dataValues.pointCodePoint,
    //         redeemDate: new Date(),
    //         expireDate: new Date(new Date().getFullYear() + 2, 11, 31),
    //         isDeleted: false,
    //         tbMemberId: req.body.memberId,
    //         tbPointCodeHDId: PointDt.dataValues.tbPointCodeHDId,
    //       };

    //       const memberPoint = await tbMemberPoint.create(historyPoint);

    //       const member = await tbMember.findOne({
    //         where: { id: req.body.memberId },
    //       });

    //       member.dataValues.memberPointExpire = new Date(
    //         new Date().getFullYear() + 2,
    //         11,
    //         31
    //       );
    //       member.dataValues.memberPoint =
    //         member.dataValues.memberPoint + Point.dataValues.pointCodePoint;

    //       const updateMember = await tbMember.update(member.dataValues, {
    //         where: { id: member.dataValues.id },
    //       });
    //     }
    //   } else {
    //     status = {
    //       coupon: redeemCode[x],
    //       isValid: false,
    //       isInvalid: true,
    //       isExpire: false,
    //       isUse: false,
    //     };
    //   }
    //   statusRedeem.push(status);
    // }
    // for (var i = 0; i < redeemCode.length; i++) {

    // }
    return res.status(200).json({ data: statusRedeem, status: true });
  } catch (err) {
    res.status(200).json({
      coupon: err.message,
      status: false,
      isValid: false,
      isInvalid: true,
      isExpire: false,
      isUse: false,
    });
  }
});

router.get(
  "/getRedemptionconditionshd",
  validateLineToken,
  async (req, res) => {
    let status = true;
    let msg;
    let RedemptionConditionsHD = [];
    try {
      const uid = Encrypt.DecodeKey(req.user.uid);
      const Member = await tbMember.findOne({
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
            "isActive",
          ],
          where: {
            isDeleted: false,
            isActive: true,
          },
        });
        if (_RedemptionConditionsHD) {
          let item = _RedemptionConditionsHD;
          for (var i = 0; i < item.length; i++) {
            let _st = new Date(item[i].startDate);
            _st.setHours(0, 0, 0, 0);
            let _en = new Date(item[i].endDate);
            _en.setHours(0, 0, 0, 0);
            let _now = new Date();
            _now.setHours(0, 0, 0, 0);
            if (_st <= _now && _en >= _now
              // new Date() >= item[i].startDate &&
              // new Date() <= item[i].endDate
            ) {
              if (item[i].redemptionType == 1) {
                if (item[i].rewardType == 1) {
                  const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
                    attributes: ["id", "expireDate", "isNotExpired"],
                    where: { redemptionConditionsHDId: item[i].id, isCancel: false },
                  });
                  if (_tbRedemptionCoupon) {
                    let _expireDate = new Date(_tbRedemptionCoupon.dataValues.isNotExpired ? new Date() : _tbRedemptionCoupon.dataValues.expireDate);
                    _expireDate.setHours(0, 0, 0, 0);
                    if (_tbRedemptionCoupon.dataValues.isNotExpired || _expireDate >= _now) {
                      item[i].dataValues.redemptionId = Encrypt.EncodeKey(
                        _tbRedemptionCoupon.dataValues.id
                      );
                      item[i].dataValues.id = Encrypt.EncodeKey(
                        item[i].dataValues.id
                      );
                      // pe : ใช้วันที่หมดอายุคูปอง
                      item[i].dataValues.isNotExpired = _tbRedemptionCoupon.dataValues.isNotExpired;
                      item[i].dataValues.endDate = _tbRedemptionCoupon.dataValues.isNotExpired
                        ? null : _tbRedemptionCoupon.dataValues.expireDate;
                      RedemptionConditionsHD.push(item[i]);
                    }
                  }
                } else {
                  const _tbRedemptionProduct =
                    await tbRedemptionProduct.findOne({
                      attributes: ["id"],
                      where: { redemptionConditionsHDId: item[i].id },
                    });
                  item[i].dataValues.redemptionId = Encrypt.EncodeKey(
                    _tbRedemptionProduct.dataValues.id
                  );
                  item[i].dataValues.id = Encrypt.EncodeKey(
                    item[i].dataValues.id
                  );
                  RedemptionConditionsHD.push(item[i]);
                }
              } else {
                item[i].dataValues.id = Encrypt.EncodeKey(
                  item[i].dataValues.id
                );
                RedemptionConditionsHD.push(item[i]);
              }
            }
          }
        }
      }
    } catch (e) {
      status = false;
      msg = e.message;
    }

    res.json({
      status: true,
      message: msg,
      Redemptionconditionshd: RedemptionConditionsHD,
    });
  }
);

router.post(
  "/getRedemptionconditionshdById",
  validateLineToken,
  async (req, res) => {
    let status = true;
    let msg;
    let RedemptionConditionsHD;
    try {
      const uid = Encrypt.DecodeKey(req.user.uid);
      const RedemptionConditionsHDId = Encrypt.DecodeKey(req.body.Id);
      const Member = await tbMember.findOne({
        attributes: ["id", "memberPoint"],
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
            "description",
          ],
          where: {
            isDeleted: false,
            id: RedemptionConditionsHDId,
          },
        });
        if (_RedemptionConditionsHD) {
          let item = _RedemptionConditionsHD.dataValues;

          if (item.redemptionType == 1) {
            if (item.rewardType == 1) {
              const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
                attributes: ["id", "couponCount"],
                where: { redemptionConditionsHDId: item.id },
              });

              item.redemptionId = Encrypt.EncodeKey(
                _tbRedemptionCoupon.dataValues.id
              );
              item.id = Encrypt.EncodeKey(item.id);

              const _tbCouponCode = await tbCouponCode.findAll({
                limit: 1,
                attributes: ["id"],
                where: {
                  redemptionCouponId: _tbRedemptionCoupon.dataValues.id,
                  isDeleted: false,
                  isUse: false,
                },
              });

              item.couponCount = _tbCouponCode && _tbCouponCode.length;
              RedemptionConditionsHD = item;
            } else {
              const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
                attributes: ["id", "rewardCount", "isNoLimitReward"],
                where: { redemptionConditionsHDId: item.id },
              });
              item.redemptionId = Encrypt.EncodeKey(
                _tbRedemptionProduct.dataValues.id
              );
              item.id = Encrypt.EncodeKey(item.id);

              const _memberReward = await tbMemberReward.findAll({
                attributes: ["id"],
                where: {
                  rewardType: "Product",
                  TableHDId: _tbRedemptionProduct.dataValues.id,
                },
              });
              if (
                _memberReward.length <= _tbRedemptionProduct.dataValues.rewardCount
              ) {
                item.rewardCount = _tbRedemptionProduct.dataValues.rewardCount - _memberReward.length;
              } else {
                item.rewardCount = 0;
              }
              item.isNoLimitReward = _tbRedemptionProduct.dataValues.isNoLimitReward;
              if (item.isNoLimitReward) {
                item.rewardCount = 1;
              }
              RedemptionConditionsHD = item;
            }
          } else {
            item.id = Encrypt.EncodeKey(item.id);
            RedemptionConditionsHD = item;
          }
        }
        RedemptionConditionsHD.isCanRedeem =
          Member.memberPoint >= RedemptionConditionsHD.points;
      }
    } catch (e) {
      status = false;
      msg = e.message;
    }

    res.json({
      status: true,
      message: msg,
      Redemptionconditionshd: RedemptionConditionsHD,
    });
  }
);

router.post("/useCoupon", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let RedemptionConditionsHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const RedemptionConditionsHDId = Encrypt.DecodeKey(req.body.Id);
    const Member = await tbMember.findOne({
      attributes: ["id", "memberPoint"],
      where: { uid: uid },
    });
    if (Member) {
      let memberPoint = Member.memberPoint;
      let _RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
        attributes: ["id", "points", "startDate", "endDate"],
        where: {
          isDeleted: false,
          id: RedemptionConditionsHDId,
        },
      });

      if (_RedemptionConditionsHD) {
        let item = _RedemptionConditionsHD.dataValues;
        //ตรวจสอบเวลา
        if (new Date() > item.startDate && new Date() <= item.endDate) {
          if (memberPoint >= item.points) {
            const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
              attributes: ["id"],
              where: { redemptionConditionsHDId: item.id },
            });
            if (_tbRedemptionCoupon) {
              const RedemptionCouponId = _tbRedemptionCoupon.dataValues.id;

              const _tbCouponCode = await tbCouponCode.findAll({
                limit: 1,
                attributes: ["id", "codeCoupon"],
                where: {
                  redemptionCouponId: RedemptionCouponId,
                  isDeleted: false,
                  isUse: false,
                },
              });
              if (_tbCouponCode) {
                if (_tbCouponCode.length > 0) {
                  //สามารถใช้คูปองได้
                  const CouponCode = _tbCouponCode[0].dataValues;
                  // ใช้คูปอง
                  const data = await tbMemberReward.create({
                    rewardType: "Coupon",
                    TableHDId: CouponCode.id,
                    redeemDate: new Date(),
                    isUsedCoupon: false,
                    isDeleted: false,
                    memberId: Member.id,
                  });
                  // update coupon
                  const dataCouponCode = await tbCouponCode.update(
                    { isUse: true },
                    { where: { id: CouponCode.id } }
                  );
                  //update คะแนน
                  const dataMember = await tbMember.update(
                    { memberPoint: Member.memberPoint - item.points },
                    { where: { id: Member.id } }
                  );
                  const _tbMemberPoint = await tbMemberPoint.create({
                    campaignType: 4,
                    code: CouponCode.codeCoupon,
                    point: -item.points,
                    redeemDate: new Date(),
                    tbMemberId: Member.id,
                    isDeleted: false,
                  });
                } else {
                  console.log('here 1')
                  status = false;
                  msg = "ขออภัย คูปองหมด";
                }
              } else {
                console.log('here 2')
                status = false;
                msg = "ขออภัย คูปองหมด";
              }
            }
          } else {
            status = false;
            msg = "ขออภัย คะแนนของคุณไม่เพียงพอ";
          }
        } else {
          status = false;
          msg = "ขออภัย โค้ดหมดอายุ";
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: msg,
    Redemptionconditionshd: RedemptionConditionsHD,
  });
});

router.post("/useProduct", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let RedemptionConditionsHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const RedemptionConditionsHDId = Encrypt.DecodeKey(req.body.Id);
    Member = await tbMember.findOne({
      attributes: ["id", "memberPoint"],
      where: { uid: uid },
    });
    if (Member) {
      let memberPoint = Member.memberPoint;
      let _RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
        attributes: ["id", "points", "startDate", "endDate"],
        where: {
          isDeleted: false,
          id: RedemptionConditionsHDId,
        },
      });

      if (_RedemptionConditionsHD) {
        let item = _RedemptionConditionsHD.dataValues;
        //ตรวจสอบเวลา
        let _st_date = new Date(item.startDate);
        _st_date.setHours(0, 0, 0, 0);
        let _en_date = new Date(item.endDate);
        _en_date.setHours(0, 0, 0, 0);
        let _now = new Date();
        _now.setHours(0, 0, 0, 0);
        if (_st_date <= _now && _now <= _en_date) {
          if (memberPoint >= item.points) {
            const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
              attributes: ["id", "isNoLimitReward", "rewardCount"],
              where: { redemptionConditionsHDId: item.id },
            });
            if (_tbRedemptionProduct) {
              const RedemptionProductId = _tbRedemptionProduct.dataValues;
              //ไม่จำกัด
              if (RedemptionProductId.isNoLimitReward) {
                //เพิ่มได้
                // ใช้คูปอง
                const data = await tbMemberReward.create({
                  rewardType: "Product",
                  TableHDId: RedemptionProductId.id,
                  redeemDate: new Date(),
                  isUsedCoupon: false,
                  isDeleted: false,
                  memberId: Member.id,
                });
                //update คะแนน
                const dataMember = await tbMember.update(
                  { memberPoint: Member.memberPoint - item.points },
                  { where: { id: Member.id } }
                );
              } else {
                const _tbRedemptionProduct = await tbMemberReward.findAll({
                  attributes: ["id"],
                  where: {
                    rewardType: "Product",
                    TableHDId: RedemptionProductId.id,
                  },
                });
                if (
                  _tbRedemptionProduct.length < RedemptionProductId.rewardCount
                ) {
                  //เพิ่มได้
                  // ใช้คูปอง
                  const data = await tbMemberReward.create({
                    rewardType: "Product",
                    TableHDId: RedemptionProductId.id,
                    redeemDate: new Date(),
                    isUsedCoupon: false,
                    isDeleted: false,
                    memberId: Member.id,
                    deliverStatus: "Wait",
                  });
                  //update คะแนน
                  const dataMember = await tbMember.update(
                    { memberPoint: Member.memberPoint - item.points },
                    { where: { id: Member.id } }
                  );

                  const _tbMemberPoint = await tbMemberPoint.create({
                    campaignType: 5,
                    code: RedemptionProductId.id,
                    point: -item.points,
                    redeemDate: new Date(),
                    tbMemberId: Member.id,
                    isDeleted: false,
                  });
                } else {
                  status = false;
                  msg = "ขออภัย สินค้าหมด";
                }
              }
            }
          } else {
            status = false;
            msg = "ขออภัย คะแนนของคุณไม่เพียงพอ";
          }
        } else {
          status = false;
          msg = "ขออภัย สินค้าหมดอายุ";
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: msg,
    Redemptionconditionshd: RedemptionConditionsHD,
  });
});
router.post("/useGame", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let RedemptionList = [];
  let itemrendom;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);

    const RedemptionConditionsHDId = Encrypt.DecodeKey(req.body.Id);
    Member = await tbMember.findOne({
      attributes: ["id", "memberPoint"],
      where: { uid: uid },
    });
    if (Member) {
      let memberPoint = Member.memberPoint;
      let _RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
        attributes: ["id", "points", "startDate", "endDate"],
        where: {
          isDeleted: false,
          id: RedemptionConditionsHDId,
        },
      });

      if (_RedemptionConditionsHD) {
        let item = _RedemptionConditionsHD.dataValues;
        //ตรวจสอบเวลา
        let _st_date = new Date(item.startDate);
        _st_date.setHours(0, 0, 0, 0);
        let _en_date = new Date(item.endDate);
        _en_date.setHours(0, 0, 0, 0);
        let _now = new Date();
        _now.setHours(0, 0, 0, 0);
        if (_now >= _st_date && _now <= _en_date) {
          if (memberPoint >= item.points) {
            //สินค้า
            const _tbRedemptionProduct = await tbRedemptionProduct.findAll({
              attributes: [
                "id",
                "isNoLimitReward",
                "rewardCount",
                "productName",
                "description",
              ],
              where: { redemptionConditionsHDId: item.id, isDeleted: false },
            });
            if (_tbRedemptionProduct) {
              for (var i = 0; i < _tbRedemptionProduct.length; i++) {
                const item = _tbRedemptionProduct[i].dataValues;
                if (item.isNoLimitReward) {
                  //ของมีไม่จำกัด
                  RedemptionList.push({
                    id: item.id,
                    type: "Product",
                    Count: "isNoLimitReward",
                  });
                } else {
                  const _tbMemberReward = await tbMemberReward.findAll({
                    attributes: ["id"],
                    where: {
                      rewardType: "Product",
                      TableHDId: item.id,
                    },
                  });
                  if (_tbMemberReward.length < item.rewardCount) {
                    //แลกของเพิ่มได้ 
                    RedemptionList.push({
                      id: item.id,
                      type: "Product",
                      imgId: Encrypt.EncodeKey(item.id),
                      name: item.productName,
                      description: item.description,
                      Count: item.rewardCount,
                    });
                  }
                }
              }
            }
            //คูปอง
            const _tbRedemptionCoupon = await tbRedemptionCoupon.findAll({
              attributes: ["id", "couponName", "description"],
              where: { redemptionConditionsHDId: item.id },
            });
            if (_tbRedemptionCoupon) {

              for (var i = 0; i < _tbRedemptionCoupon.length; i++) {
                const item = _tbRedemptionCoupon[i].dataValues;
                const _tbCouponCode = await tbCouponCode.findAll({
                  limit: 1,
                  attributes: ["id", "codeCoupon"],
                  where: {
                    redemptionCouponId: item.id,
                    isDeleted: false,
                    isUse: false,
                  },
                });
                if (_tbCouponCode.length > 0) {
                  //มีคูปองใช้งานได้
                  RedemptionList.push({
                    id: _tbCouponCode[0].dataValues.id,
                    codeCoupon: _tbCouponCode[0].dataValues.codeCoupon,
                    type: "Coupon",
                    imgId: Encrypt.EncodeKey(
                      _tbRedemptionCoupon[i].dataValues.id
                    ),
                    name: _tbRedemptionCoupon[i].dataValues.couponName,
                    description: _tbRedemptionCoupon[i].dataValues.description,
                    Count: 1,
                  });
                }
              }
            }

            //ขอรางวัลยังไม่หมด
            if (RedemptionList.length > 0) {
              // สุ่มจาก list
              itemrendom =
                RedemptionList[
                Math.floor(Math.random() * RedemptionList.length)
                ];
              if (itemrendom.type == "Coupon") {
                // ใช้คูปอง
                const data = await tbMemberReward.create({
                  rewardType: "Coupon",
                  TableHDId: itemrendom.id,
                  redeemDate: new Date(),
                  isUsedCoupon: false,
                  isDeleted: false,
                  memberId: Member.id,
                });
                // update coupon
                const dataCouponCode = await tbCouponCode.update(
                  { isUse: true },
                  { where: { id: itemrendom.id } }
                );
                //update คะแนน
                const dataMember = await tbMember.update(
                  { memberPoint: Member.memberPoint - item.points },
                  { where: { id: Member.id } }
                );

                const _tbMemberPoint = await tbMemberPoint.create({
                  campaignType: 6,
                  code: itemrendom.codeCoupon,
                  point: -item.points,
                  redeemDate: new Date(),
                  tbMemberId: Member.id,
                  isDeleted: false,
                });
              } else {
                console.log(itemrendom.id)
                const data = await tbMemberReward.create({
                  rewardType: "Product",
                  TableHDId: itemrendom.id,
                  redeemDate: new Date(),
                  isUsedCoupon: false,
                  isDeleted: false,
                  memberId: Member.id,
                  deliverStatus: "Wait",
                });
                //update คะแนน
                const dataMember = await tbMember.update(
                  { memberPoint: Member.memberPoint - item.points },
                  { where: { id: Member.id } }
                );

                const _tbMemberPoint = await tbMemberPoint.create({
                  campaignType: 6,
                  // , code: item.id
                  point: -item.points,
                  redeemDate: new Date(),
                  tbMemberId: Member.id,
                  isDeleted: false,
                });
              }
              itemrendom = {
                id: itemrendom.imgId,
                name: itemrendom.name,
                description: itemrendom.description,
                type: itemrendom.type,
              };
            } else {
              status = false;
              msg = "ขออภัย ของรางวัลหมด";
            }
          } else {
            status = false;
            msg = "ขออภัย คะแนนของคุณไม่เพียงพอ";
          }
        } else {
          status = false;
          msg = "ขออภัย รางวัลหมดอายุ";
        }
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: msg,
    itemrendom: itemrendom,
  });
});

module.exports = router;
