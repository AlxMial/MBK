const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { tbReturnOrder, tbImage, tbOrderHD } = require("../../models");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();
const db = require("../../models");

router.post("/", validateToken, async (req, res) => {
  const data = await tbReturnOrder.create(req.body);
  res.json({
    status: true,
    message: "success",
    tbReturnOrder: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  const data = await tbReturnOrder.findAll({
    where: { isDeleted: false },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
                        select netTotal from tborderhds
				                            where isDeleted=0
				                            and id = tbReturnOrder.orderId
                    )`),
          "sumPrice",
        ],
        [
          Sequelize.literal(`(
                        select memberId from tborderhds t
                            where id = tbReturnOrder.orderId
                            and isDeleted = 0
                    )`),
          "memberId",
        ],
        [
          Sequelize.literal(`(
                        select orderNumber from tborderhds t
                            where id = tbReturnOrder.orderId
                            and isDeleted = 0
                    )`),
          "orderNumber",
        ],
        [
          Sequelize.literal(`(
                        select orderDate from tborderhds t
                            where id = tbReturnOrder.orderId
                            and isDeleted = 0
                    )`),
          "orderDate",
        ],
      ],
    },
    order: [["createdAt", "DESC"]],
  });
  res.json({
    status: true,
    message: "success",
    tbReturnOrder: data,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbReturnOrder.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbReturnOrder: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  const data = await tbReturnOrder.findOne({
    where: {
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  const dataUpdate = await tbReturnOrder.update(req.body, {
    where: { id: req.body.id },
  });
  const _tbOrderHD = await tbOrderHD.update(
    { isReturn: true },
    {
      where: { id: req.body.orderId },
    }
  );

  res.json({
    status: true,
    message: "success",
    tbReturnOrder: dataUpdate,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbReturnOrder.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbReturnOrder: null });
});

//#region line liff
router.post("/returnOrder", validateLineToken, async (req, res) => {
  let { orderId, returnDetail, description, returnImage } = req.body;
  let status = true;
  let msg = "";
  let t;
  try {
    t = await db.sequelize.transaction();
    //#region update
    const data = await tbReturnOrder.create({
      orderId: Encrypt.DecodeKey(orderId),
      returnStatus: 1,
      returnType: 1,
      returnDetail: returnDetail,
      description: description,
      isDeleted: false,
    });
    if (data) {
      const _tbImage = await tbImage.create({
        createdAt: new Date(),
        relatedId: data.dataValues.id,
        image: returnImage,
        isDeleted: false,
        relatedTable: "tbReturnOrder",
      });
    }
    //#endregion update
    await t.commit();
  } catch (e) {
    if (t) {
      await t.rollback();
    }
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: msg,
    tbCancelOrder: req.body,
  });
});
//#endregion line liff
module.exports = router;
