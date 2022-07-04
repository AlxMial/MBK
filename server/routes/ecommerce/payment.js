const express = require("express");
const router = express.Router();
const axios = require('axios').default;
const { tbPayment, tbPromotionStore, tbOrderHD, tb2c2p } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const jwt = require("jsonwebtoken");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


router.post("/", validateToken, async (req, res) => {
  const data = await tbPayment.create(req.body);
  res.json({
    status: true,
    message: "success",
    tbPayment: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  const data = await tbPayment.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPayment: data,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbPayment.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPayment: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  let msg = "";
  let status = true;
  let _tbPayment;
  try {
    const data = await tbPayment.findOne({
      where: {
        isDeleted: false,
        id: req.body.id,
      },
    });

    if (data) {
      // update ได้
      const dataUpdate = await tbPayment.update(req.body, {
        where: { id: req.body.id },
      });
      msg = "success";
      _tbPayment = dataUpdate;
    } else {
      status = false;
      tbPayment = null;
      msg = "Payment empty !";
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  res.json({
    status: status,
    message: msg,
    tbPayment: _tbPayment,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbPayment.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbPayment: null });
});

//#region line liff
router.get("/gettbPayment", validateLineToken, async (req, res) => {
  // let data = []
  let code = 200;
  let option = [];
  try {
    const data = await tbPayment.findAll({
      attributes: [
        "id",
        "accountName",
        "accountNumber",
        "bankBranchName",
        "bankName",
      ],
      where: { isDeleted: false },
    });

    if (data) {
      data.map((e) => {
        option.push({
          id: Encrypt.EncodeKey(e.id),
          accountName: e.accountName,
          accountNumber: e.accountNumber,
          bankBranchName: e.bankBranchName,
          bankName: e.bankName,
        });
      });
    }
  } catch (e) {
    code = 300;
  }

  res.json({
    code: code,
    tbPayment: option,
  });
});

router.get("/getPromotionstores", validateLineToken, async (req, res) => {
  // let data = []
  let status = true;
  let promotionStore = [];
  try {
    const _tbPromotionStore = await tbPromotionStore.findAll({
      attributes: [
        "id",
        "buy",
        "condition",
        "discount",
        "percentDiscount",
        "percentDiscountAmount",
        "stockId",
        "campaignName",
      ],
      where: {
        isDeleted: false,
        isInactive: true,
      },
    });
    if (_tbPromotionStore) {
      _tbPromotionStore.map((e, i) => {
        let item = e.dataValues;
        item.id = Encrypt.EncodeKey(item.id);
        item.stockId = Encrypt.EncodeKey(item.stockId);
        promotionStore.push(item);
      });
    }
  } catch (e) {
    status = false;
  }

  res.json({
    status: status,
    promotionStore: promotionStore,
  });
});
router.post("/getPaymentsucceed", validateLineToken, async (req, res) => {
  let id = Encrypt.DecodeKey(req.body.id);
  try {
    const _2c2p = await tb2c2p.findOne({
      where: { orderId: id, uid: req.body.uid },
    });
    if (_2c2p) {
      axios.post('https://sandbox-pgw.2c2p.com/payment/4.1/PaymentInquiry', {
        payload: _2c2p.payload
      })
        .then(async function (response) {
          let decoded = jwt.decode(response.data.payload);
          if (decoded.respDesc == "Success") {
            let referenceNo = decoded.referenceNo;
            await tbOrderHD.update(
              {
                transetionId: referenceNo,
                paymentDate: new Date(),
                paymentStatus: 3,
              },
              {
                where: {
                  id: Encrypt.DecodeKey(id.split(",")[0]),
                  // id: id.split(",")[0],
                  orderNumber: id.split(",")[1],
                },
              }
            );
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      const _tbOrderHD = await tbOrderHD.findOne({
        attributes: ["orderNumber", "paymentStatus", "netTotal"],
        where: {
          id: Encrypt.DecodeKey(id.split(",")[0]),
          orderNumber: id.split(",")[1],
        },
      });
      res.json({
        status: true,
        orderNumber: id.split(",")[1],
        OrderHD: _tbOrderHD
      });
    } else {
      const _tbOrderHD = await tbOrderHD.findOne({
        attributes: ["orderNumber", "paymentStatus"],
        where: {
          id: Encrypt.DecodeKey(id.split(",")[0]),
          orderNumber: id.split(",")[1],
        },
      });
      res.json({
        status: false,
        orderNumber: id.split(",")[1],
        OrderHD: _tbOrderHD
      });
    }
  } catch (e) {
    res.json({
      status: false,
      orderNumber: '',
    });
  }

  // res.json({
  //   status: true,
  //   orderNumber:id.split(",")[1],
  // });
});

//#endregion line liff

module.exports = router;
