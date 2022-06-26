const express = require("express");
const router = express.Router();
const { tbMember, tbMemberPoint, tbPointCodeHD, tbPointCodeDT } = require("../../models");
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
          pointCodeName:  tb_pointCodeHD !== null ? tb_pointCodeHD.pointCodeName : "",
          startDate:  (tb_pointCodeHD !== null) ? tb_pointCodeHD.startDate : "",
          endDate:   (tb_pointCodeHD !== null) ? tb_pointCodeHD.endDate : "",
          pointTypeId: obj.campaignType,
          memberName: obj.campaignType === "1" ? fullname :"",
          phone   : obj.campaignType === "1" ? (tb_member !== null ? Encrypt.DecodeKey(tb_member.phone) : "") : "",       
          point: obj.point,
          exchangedate: obj.redeemDate,
        });  
    });
    res.json(tutorials);
  });  
});

router.get("/exportExcel/:id", validateToken, async (req, res) => {
  tbMember.hasMany(tbMemberPoint, { foreignKey: "id" });
  tbPointCodeDT.belongsTo(tbMember, { foreignKey: "memberId" }); 
  tbPointCodeDT.belongsTo(tbMemberPoint, { foreignKey: "memberId" });  
    const id = req.params.id;
    tbPointCodeDT.findAll({
         where: { tbPointCodeHDId: id , isDeleted: false},
         include: [
          {
            model: tbMember,
            where: { isDeleted: false },
            required: false,
          },
          {
            model: tbMemberPoint,
            where: { isDeleted: false },
            required: false,
          },
        ],            
         }).then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        const tb_member =  obj.tbMember !== null ? obj.tbMember : null;
        const tb_memberPoint =  obj.tbMemberPoint !== null ? obj.tbMemberPoint : null;
        const fullname = tb_member !== null ? (Encrypt.DecodeKey(tb_member.firstName) + ' ' + Encrypt.DecodeKey(tb_member.lastName)) : "";
        tutorials.push({
          code: Encrypt.DecodeKey(obj.code).toUpperCase(),
          isUse: obj.isUse ? "ใช้งาน" : "ยังไม่ได้ใช้งาน",
          isExpire: obj.isExpire ? "หมดอายุ" : "ยังไม่หมดอายุ",
          memberName: tb_member !== null ? fullname :"",
          dateUseCode: tb_memberPoint !== null ? tb_memberPoint.redeemDate : "",
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
              //code: obj.code !== null ? Encrypt.DecodeKey(obj.code).toUpperCase() : "", 
              pointCodeName:  obj.pointCodeName,
              startDate: obj.startDate,
              endDate:   obj.endDate ,
              tbMemberPoint:  Encrypt.decodePointCode(obj.tbMemberPoints),
              tbPointCodeDT:  Encrypt.decodePointCode(obj.tbPointCodeDTs),
              isType: obj.isType,
              pointCodePoint: obj.pointCodePoint,
              // isUse: obj.campaignType,
              // memberName: obj.campaignType === "1" ? fullname :"",
              // phone   : obj.campaignType === "1" ? (tb_member !== null ? Encrypt.DecodeKey(tb_member.phone) : "") : "",       
              // point: obj.point,
              // exchangedate: obj.redeemDate,
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
module.exports = router;
