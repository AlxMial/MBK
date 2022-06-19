const express = require("express");
const router = express.Router();
const { tbMember, tbPointCodeHD, tbPointCodeDT } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.get("/ShowCollectPoints", validateToken, async (req, res) => {
    const listPointCodeDT = await tbPointCodeDT.findAll(
      { 
      where: { isDeleted: false , isUse: true},
      // include: [
      //   {
      //     model: tbPointCodeHD,
      //     attributes: [],
      //   },
      // ],
    });
    if (listPointCodeDT.length > 0) {
      const ValuesDecrypt = Encrypt.decryptAllDataArray(listPointCodeDT);
      Encrypt.encryptValueIdArray(ValuesDecrypt);
      res.json({ status: true, message: "success", tbPointCodeDT: ValuesDecrypt });
    } else res.json({ error: "not found member" });
});

router.get("/exportExcel/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    tbPointCodeDT.findAll({
         where: { tbPointCodeHDId: id , isDeleted: false}, 
        //  attributes: {
        //   include: [
        //     [
        //       Sequelize.literal(`(
        //           SELECT COUNT(id)
        //           FROM tbMember
        //           WHERE
        //           tbMemberPoints.tbPointCodeHDId = tbPointCodeHD.id AND
        //           tbMemberPoints.isDeleted = 0
        //       )`),
        //       "useCount",
        //     ],
        //   ],
        // },        
         }).then((objs) => {
      let tutorials = [];
      objs.forEach((obj) => {
        tutorials.push({
          code: Encrypt.DecodeKey(obj.code).toUpperCase(),
          isUse: obj.isUse ? "ใช้งาน" : "ยังไม่ได้ใช้งาน",
          isExpire: obj.isExpire ? "หมดอายุ" : "ยังไม่หมดอายุ",
          memberName: "name test",
          dateUseCode: new Date(),
        });
      });
      res.json(tutorials);
    });
  });

module.exports = router;
