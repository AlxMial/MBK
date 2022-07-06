const express = require("express");
const router = express.Router();
const { tbMember,
  tbMemberPoint,
  tbPointCodeHD, 
  tbPointCodeDT, 
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbMemberReward,
  tbCouponCode, } = require("../../models");
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

router.get("/ShowCollectPoints", validateToken, async (req, res) => {
  tbMember.hasMany(tbMemberPoint, { foreignKey: "id" });
  tbMemberPoint.belongsTo(tbMember, { foreignKey: "tbMemberId" });
  tbMemberPoint.belongsTo(tbPointCodeHD, { foreignKey: "tbPointCodeHDId" });  
  tbMemberPoint.findAll({
    where: { isDeleted: false },
    include: [
      {
        model: tbMember,
        where: { isDeleted: false },
        required: false,
      },
      {
        model: tbPointCodeHD,
        where: { isDeleted: false },
        required: false,
      },
    ],
  }).then((objs) => {
    let tutorials = [];
    objs.forEach((obj) => {
      const tb_member =  obj.tbMember !== null ? obj.tbMember : null;
      const tb_pointCodeHD =  obj.tbPointCodeHD !== null ? obj.tbPointCodeHD : null;
      const fullname = tb_member !== null ? (Encrypt.DecodeKey(tb_member.firstName) + ' ' + Encrypt.DecodeKey(tb_member.lastName)) : "";
      tutorials.push({
          code: obj.code !== null ? Encrypt.DecodeKey(obj.code).toUpperCase() : "", 
          pointCodeName:  obj.campaignType === "3" ? "สมัครสมาชิก" : (tb_pointCodeHD !== null ? tb_pointCodeHD.pointCodeName : ""),
          startDate:  (tb_pointCodeHD !== null) ? tb_pointCodeHD.startDate : "",
          endDate:   (tb_pointCodeHD !== null) ? tb_pointCodeHD.endDate : "",
          pointTypeId: obj.campaignType,
          memberName: fullname,
          phone   : (tb_member !== null ? Encrypt.DecodeKey(tb_member.phone) : ""),       
          point: obj.point,
          exchangedate: obj.redeemDate,
        });  
    });
    res.json(tutorials);
  });  
});


router.get("/ShowCampaignReward", validateToken, async (req, res) => {
  tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, { foreignKey: "redemptionConditionsHDId" });
  tbRedemptionProduct.belongsTo(tbRedemptionConditionsHD, { foreignKey: "redemptionConditionsHDId" });
  tbRedemptionCoupon.belongsTo(tbCouponCode, { foreignKey: "id" });
  const listMemberReward = await tbMemberReward.findAll({
    where: { isDeleted: false },
  });
 
  tbRedemptionConditionsHD.findAll({
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
        where: { isDeleted: false},
        required: false,
        include: [
          {
            model: tbCouponCode,
            where: { isDeleted: false , isUse: true},
            required: false,           
          },          
        ]
      },
    ]
  }).then((objs) => {
    let tutorials = [];    
    objs.forEach((obj) => {
      let expiredDate = "";
      let exchangedTotal = 0;
      const rewardTotal = ((obj.dataValues.couponsCount !== null ? parseInt(obj.dataValues.couponsCount, 10) : 0)  + 
                        (obj.dataValues.productCount !== null ? parseInt(obj.dataValues.productCount, 10) :0));
      // Products
      if(obj.tbRedemptionProducts.length > 0) {
        obj.tbRedemptionProducts.forEach(e => {
               const m_reward = listMemberReward.find(el => el.TableHDId === e.id.toString());
                if(m_reward !== undefined) {
                  exchangedTotal +=  parseInt(e.rewardCount, 10);
                }
        });         
      }
      // Coupons
      if(obj.tbRedemptionCoupons.length > 0) {
        obj.tbRedemptionCoupons.forEach(e => {
             if(e.tbCouponCodes.length > 0) {
              e.tbCouponCodes.forEach(ele => {
                const m_Coupon = listMemberReward.find(el => el.TableHDId === ele.id.toString() && el.isUsedCoupon);
                if(m_Coupon !== undefined) {
                  exchangedTotal +=  parseInt(e.couponCount, 10);
                  expiredDate = e.expiredDate !== null ? e.expiredDate :"";
                }
              });
             }
               
        });         
      }
      tutorials.push({
          redemptionName:  obj.redemptionName,
          redemptionType:  obj.redemptionType,
          rewardType: obj.rewardType ,  
          points:  obj.points,
          startDate: obj.startDate,
          endDate: obj.endDate,
          expiredDate: expiredDate,            
          point: obj.point,
          exchangedate: obj.redeemDate,
          rewardTotal: rewardTotal,
          exchangedTotal: exchangedTotal,
          toTal: (rewardTotal - exchangedTotal),
        });  
    });
    res.json(tutorials);
  }); 
});

router.get("/ShowCampaignExchange", validateToken, async (req, res) => {
  tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, { foreignKey: "redemptionConditionsHDId" });
  tbRedemptionProduct.belongsTo(tbRedemptionConditionsHD, { foreignKey: "redemptionConditionsHDId" });
  tbCouponCode.belongsTo(tbRedemptionCoupon, { foreignKey: "redemptionCouponId" });
  const listRedemptionConditionsHD = await tbRedemptionConditionsHD.findAll({
    where: { isDeleted: false }
  });
  const listCouponCode = await tbCouponCode.findAll({
    where: { isDeleted: false , isUse: true},
    include: [
      { 
        model: tbRedemptionCoupon,
        where: { isDeleted: false},
        required: false,
        include: [
          { 
            model: tbRedemptionConditionsHD,
            where: { isDeleted: false},
            required: false,
          }
        ]
      },     
  ]
  }); 
  tbMemberReward.belongsTo(tbMember, { foreignKey: "memberId" });
  tbMemberReward.findAll({
    where: { isDeleted: false },
    include: [
      {
        model: tbMember,
        where: { isDeleted: false },
        required: false,
      },      
    ],
  }).then((objs) => {
    let tutorials = [];
    objs.forEach((obj) => {
      const tb_member =  obj.tbMember !== null ? obj.tbMember : null;
      let deliverStatus = "", trackingNo = "", code = "", status = '', isShowControl = false;
      let redemptionName = "", rewardType = "", redemptionType = "", points = "";
      const fullname = tb_member !== null ? (Encrypt.DecodeKey(tb_member.firstName) + ' ' + Encrypt.DecodeKey(tb_member.lastName)) : "";
      const address =  tb_member !== null ? Encrypt.DecodeKey(tb_member.address) : "";
      let startDate = "";
      let endDate = "";
      if(obj.rewardType === "Coupon") {
        const lCouponCode = listCouponCode.filter(e => e.id.toString() === obj.TableHDId);
        if(lCouponCode.length > 0) {
          const rdCupon = lCouponCode[0].tbRedemptionCoupon;
          status = (rdCupon !== null && !rdCupon.iscancel && lCouponCode[0].isUse) ? 1 : 0;
          code = Encrypt.DecodeKey(lCouponCode[0].codeCoupon);
          if(rdCupon !== null && rdCupon.tbRedemptionConditionsHD !== null) {
            redemptionName = rdCupon.tbRedemptionConditionsHD.redemptionName;
            redemptionType = rdCupon.tbRedemptionConditionsHD.redemptionType;
            rewardType = rdCupon.tbRedemptionConditionsHD.rewardType;
            points =  rdCupon.tbRedemptionConditionsHD.points;
            startDate = rdCupon.tbRedemptionConditionsHD.startDate;
            endDate = rdCupon.tbRedemptionConditionsHD.endDate;
          }
        }
      } else {
        const lRedemptionProduct = listRedemptionConditionsHD.filter(e => e.id.toString() === obj.TableHDId);
        if(lRedemptionProduct.length > 0) {
          const rwHD = lRedemptionProduct[0];
          deliverStatus = obj.deliverStatus;
          trackingNo = obj.trackingNo;
          status = 1;
          isShowControl = rwHD.rewardType === '1' ? false : true;
          if(rwHD !== null) {
            redemptionName = rwHD.redemptionName;
            redemptionType = rwHD.redemptionType;
            rewardType = rwHD.rewardType;
            points =  rwHD.points;
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
          startDate:  startDate,
          endDate:  endDate ,
          firstName: (tb_member !== null ?tb_member.firstName : 0),
          lastName: (tb_member !== null ?tb_member.lastName : 0),
          memberName: fullname,
          address:  isShowControl ? address : "",
          subDistrict: (tb_member !== null && isShowControl ?tb_member.subDistrict : 0),
          district: (tb_member !== null && isShowControl ? tb_member.district : 0),
          postcode: (tb_member !== null && isShowControl ? tb_member.postcode : 0),
          province: (tb_member !== null && isShowControl ? tb_member.province : 0),
          phone   : (tb_member !== null && isShowControl ? Encrypt.DecodeKey(tb_member.phone) : ""),   
          deliverStatus : deliverStatus,
          trackingNo: trackingNo,
          points: points,
          redeemDate: obj.redeemDate,
          isShowControl: isShowControl,
          isShowTKNo: false,
          status: status
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
    tbPointCodeDT.findAll({
         where: { tbPointCodeHDId: id , isDeleted: false},
         required: false,
         include: [          
          {
            model: tbPointCodeHD,
            where: { isDeleted: false, id: id  },
            required: false,
            include: [
              {
                model: tbMemberPoint,
                where: { isDeleted: false, tbPointCodeHDId: id},
                required: false,
                include: [
                  {
                    model: tbMember,
                    where: { isDeleted: false},
                    required: false,
                  },
                ]
              },
            ]
          },
        ],            
         }).then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        let fullname = "";
        let redeemDate = "";
        const code = Encrypt.DecodeKey(obj.code).toUpperCase();
        if(obj.tbPointCodeHD.tbMemberPoints.length > 0) {
         Encrypt.decodePointCode(obj.tbPointCodeHD.tbMemberPoints);
         tbMemberPoints = obj.tbPointCodeHD.tbMemberPoints.find(el => el.code.toUpperCase() === code);
          if(tbMemberPoints !== undefined) {
            redeemDate = tbMemberPoints.redeemDate;
              if(tbMemberPoints.tbMember !== undefined) {
               const memeber = Encrypt.decryptAllData(tbMemberPoints.tbMember);
               fullname = memeber.firstName + " " + memeber.lastName
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
    where: {  isDeleted: false }}); 
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
  tbPointCodeHD.findAll({
    where: { 
      isDeleted: false ,
      id: id
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
        ]
      },
      {
        model: tbPointCodeDT,
        where: { isDeleted: false },
        //required: false,
      },
    ],
    }).then((objs) => {
      if(objs.length === 1) {
        let tutorials = [];
        objs.forEach((obj) => {
          obj.tbMemberPoints.forEach(el => {
              el.tbMember = Encrypt.decryptAllData(el.tbMember);
          });
         
          tutorials.push({
              pointCodeName:  obj.pointCodeName,
              startDate: obj.startDate,
              endDate:   obj.endDate ,
              tbMemberPoint:  Encrypt.decodePointCode(obj.tbMemberPoints),
              tbPointCodeDT:  Encrypt.decodePointCode(obj.tbPointCodeDTs),
              isType: obj.isType,
              pointCodePoint: obj.pointCodePoint,
          });  
        });
        res.json(tutorials);
      } else{
        res.json({
          status: false,
          message: "failed"
        });
      }
  }); 
});

router.post("/doSaveUpdateMemberReward", validateToken, async (req, res) => {
  
      let data  = req.body     
      const uptbMemberReward = await tbMemberReward.update(
        {
            trackingNo:data.trackingNo,
            deliverStatus: data.deliverStatus,
        },
        { where: { id:  Encrypt.DecodeKey(data.id)}}
      );
        res.json({
        status: true,
        message: "success",
        tbStock: uptbMemberReward,
      });
});
module.exports = router;
