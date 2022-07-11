const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const {
  tbCancelOrder,
  tbOrderDT,
  tbStock,
  tbOrderHD,
} = require("../../models");
const Op = Sequelize.Op;
const db = require("../../models");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
  let status = true;
  let msg = "success";
  let data;
  try {
    data = await tbCancelOrder.create(req.body);
    //#region update ราคาสินค้า
    if (data) {
      const orderId = req.body.orderId;
      const OrderDTData = await tbOrderDT.findAll({
        attributes: ["amount", "stockId"],
        where: {
          IsDeleted: false,
          orderId: orderId,
          isFree: false,
        },
      });

      if (OrderDTData) {
        for (var i = 0; i < OrderDTData.length; i++) {
          let _tbStockData = await tbStock.findOne({
            attributes: ["productCount"],
            where: { id: OrderDTData[i].stockId },
          });
          if (_tbStockData) {
            let _tbStock = await tbStock.update(
              {
                productCount: _tbStockData.productCount + OrderDTData[i].amount,
              },
              {
                where: {
                  id: OrderDTData[i].stockId,
                },
              }
            );
          }
        }
      }
    }
    //#region update ราคาสินค้า
  } catch (e) {
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: "success",
    tbCancelOrder: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  const data = await tbCancelOrder.findAll({
    where: { isDeleted: false },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
                        select netTotal from tborderhds
				                            where isDeleted=0
				                            and id = tbCancelOrder.orderId
                    )`),
          "sumPrice",
        ],
        [
          Sequelize.literal(`(
                        select memberId from tborderhds t
                            where id = tbCancelOrder.orderId
                            and isDeleted = 0
                    )`),
          "memberId",
        ],
        [
          Sequelize.literal(`(
                        select orderNumber from tborderhds t
                            where id = tbCancelOrder.orderId
                            and isDeleted = 0
                    )`),
          "orderNumber",
        ],
        [
          Sequelize.literal(`(
                        select orderDate from tborderhds t
                            where id = tbCancelOrder.orderId
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
    tbCancelOrder: data,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbCancelOrder.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbCancelOrder: data,
  });
});

router.get("/byOrderId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbCancelOrder.findOne({ where: { orderId: id } });
  res.json({
    status: true,
    message: "success",
    tbCancelOrder: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  const data = await tbCancelOrder.findOne({
    where: {
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  const dataUpdate = await tbCancelOrder.update(req.body, {
    where: { id: req.body.id },
  });
  const _tbOrderHD = await tbOrderHD.update(
    { isCancel: true },
    {
      where: { id: req.body.orderId },
    }
  );

  //#region update ราคาสินค้า
  const OrderDTData = await tbOrderDT.findAll({
    attributes: ["amount", "stockId"],
    where: {
      IsDeleted: false,
      orderId: req.body.id,
      isFree: false,
    },
  });

  if (OrderDTData) {
    for (var i = 0; i < OrderDTData.length; i++) {
      let _tbStockData = await tbStock.findOne({
        attributes: ["productCount"],
        where: { id: OrderDTData[i].stockId },
      });
      if (_tbStockData) {
        let _tbStock = await tbStock.update(
          { productCount: _tbStockData.productCount + OrderDTData[i].amount },
          {
            where: {
              id: OrderDTData[i].stockId,
            },
          }
        );
      }
    }
  }
  //#region update ราคาสินค้า

  res.json({
    status: true,
    message: "success",
    tbCancelOrder: dataUpdate,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbCancelOrder.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbCancelOrder: null });
});

//#region line liff
router.post("/cancelOrder", validateLineToken, async (req, res) => {
  let { orderId, cancelDetail, description } = req.body;
  let status = true;
  let msg = "";
  let t
  try {
    t = await db.sequelize.transaction();
    //#region add tb Cancel
    const data = await tbCancelOrder.create({
      orderId: Encrypt.DecodeKey(orderId),
      cancelStatus: 1,
      cancelType: 2,
      cancelDetail: cancelDetail,
      description: description,
      isDeleted: false,
    });
    //#region add tb Cancel

    //#region update ราคาสินค้า
    const OrderDTData = await tbOrderDT.findAll({
      attributes: ["amount", "stockId"],
      where: {
        IsDeleted: false,
        orderId: Encrypt.DecodeKey(orderId),
        isFree: false,
      },
    });

    if (OrderDTData) {
      for (var i = 0; i < OrderDTData.length; i++) {
        let _tbStockData = await tbStock.findOne({
          attributes: ["productCount"],
          where: { id: OrderDTData[i].stockId },
        });
        if (_tbStockData) {
          let _tbStock = await tbStock.update(
            { productCount: _tbStockData.productCount + OrderDTData[i].amount },
            {
              where: {
                id: OrderDTData[i].stockId,
              },
            }
          );
        }
      }
    }
    //#region update ราคาสินค้า
    //#region เอาคูปองออก
    const _tbOrderHD = await tbOrderHD.update(
      { memberRewardId: null },
      {
        where: { id: Encrypt.DecodeKey(orderId) },
      }
    );
    //#endregion เอาคูปองออก
    await t.commit();
  } catch (e) {
    status = false;
    msg = e.message;
    if (t) {
      await t.rollback();
    }

  }

  res.json({
    status: status,
    message: msg,
    tbCancelOrder: req.body,
  });
});
//#endregion line liff
module.exports = router;
