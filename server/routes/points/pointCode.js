const express = require("express");
const router = express.Router();
const { tbPointCodeHD, tbPointCodeDT, tbMemberPoint } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();


router.post("/", validateToken, async (req, res) => {
  let postCodeHD;
  if (req.body.pointCodeSymbol) {
    postCodeHD = await tbPointCodeHD.findOne({
      where: {
        [Op.or]: [
          { pointCodeName: req.body.pointCodeName },
          { pointCodeSymbol: req.body.pointCodeSymbol },
        ],
        isDeleted: false,
      },
    });
  } else {
    postCodeHD = await tbPointCodeHD.findOne({
      where: {
        pointCodeName: req.body.pointCodeName,
        isDeleted: false,
      },
    });
  }

  if (!postCodeHD) {
    const postCode = await tbPointCodeHD.create(req.body);
    res.json({
      status: true,
      isPointCodeName: false,
      message: "success",
      tbPointCodeHD: postCode,
    });
  } else {
    if (postCodeHD.pointCodeName === req.body.pointCodeName) {
      res.json({
        status: false,
        isPointCodeName: true,
        isPointCodeSymbol: false,
        message: "unsuccess",
        tbPointCodeHD: null,
      });
    } else {
      res.json({
        status: false,
        isPointCodeName: false,
        isPointCodeSymbol: true,
        message: "unsuccess",
        tbPointCodeHD: null,
      });
    }
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointCodeHD = await tbPointCodeHD.findAll({
    where: { isDeleted: false },
    attributes: {
      include: [
        // [
        //   Sequelize.fn("COUNT", Sequelize.col("tbpointcodedts.id")),
        //   "codeCount",
        // ],
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
    order: [["createdAt", "DESC"]],
  });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: listPointCodeHD,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const listPointCodeHD = await tbPointCodeHD.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPointCodeHD: listPointCodeHD,
  });
});

router.put("/", validateToken, async (req, res) => {
  const postCodeHD = await tbPointCodeHD.findOne({
    where: {
      pointCodeName: req.body.pointCodeName,
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!postCodeHD) {
    const listPointCodeHD = await tbPointCodeHD.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({
      status: true,
      message: "success",
      tbPointCodeHD: listPointCodeHD,
    });
  } else {
    res.json({
      status: false,
      isPointCodeName: true,
      message: "success",
      tbPointCodeHD: null,
    });
  }
});

router.delete("/:tbPointCodeHDId", validateToken, async (req, res) => {
  const tbPointCodeHDId = req.params.tbPointCodeHDId;
  req.body.isDeleted = true;
  tbPointCodeHD.update(req.body, { where: { id: tbPointCodeHDId } });
  tbPointCodeDT.update(req.body, {
    where: { tbPointCodeHDId: tbPointCodeHDId },
  });
  res.json({ status: true, message: "success", tbPointCodeHD: null });
});

router.delete("/delete/:tbPointCodeHDId", validateToken, async (req, res) => {
  tbPointCodeHD.destroy({
    where: {
      id: req.params.tbPointCodeHDId,
    },
  });
  res.json({ status: true, message: "success", tbPointCodeHD: null });
});

router.get("/exportExcel/:id", validateToken, async (req, res) => {
  const id = req.params.id;

  tbPointCodeDT
    .findAll({ where: { tbPointCodeHDId: id } })
    .then(async (objs) => {
      let tutorials = [];
      const pointCodeHD = await tbPointCodeHD.findOne({ where: { id: id } });
      let setExpire = false;
      if (pointCodeHD) {
        if (new Date(pointCodeHD.dataValues.endDate) < new Date()) {
          setExpire = true;
          await tbPointCodeDT.update(
            { isExpire: true },
            { where: { tbPointCodeHDId: pointCodeHD.dataValues.id } }
          );
        }

        objs.forEach((obj) => {
          tutorials.push({
            name: pointCodeHD.dataValues.pointCodeName,
            point: pointCodeHD.dataValues.pointCodePoint,
            startDate: pointCodeHD.dataValues.startDate,
            endDate: pointCodeHD.dataValues.endDate,
            code: Encrypt.DecodeKey(obj.code).toUpperCase(),
            isUse: obj.isUse ? "??????????????????" : "?????????????????????????????????????????????",
            isExpire: setExpire ? "?????????????????????" : "???????????????????????????????????????",
          });
        });
        res.json(tutorials);
      }
    });
});

module.exports = router;
