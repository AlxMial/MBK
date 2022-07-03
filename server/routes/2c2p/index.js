const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const { tbOrderHD, tb2c2p } = require("../../models");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", async (req, res) => {
  const orderId = Encrypt.DecodeKey(req.body.orderId);
  const uid = req.body.uid;
  const _2c2p = await tb2c2p.findOne({
    where: { orderId: orderId, uid: uid },
  });
  if (_2c2p) {
    const inquiry = await axios.post(
      "https://sandbox-pgw.2c2p.com/payment/4.1/PaymentInquiry",
      {
        payload: _2c2p.payload,
      }
    );
    if (inquiry) {
      let decoded = jwt.decode(inquiry.data.payload);

      if (decoded.respDesc == "Success") {
        let invoiceNo = decoded.invoiceNo;
        let referenceNo = decoded.referenceNo;
        const _tbOrderHD = await tbOrderHD.update(
          {
            transetionId: referenceNo,
            paymentDate: new Date(),
            paymentStatus: 3,
          },
          {
            where: {
              id: orderId.split(",")[0],
              orderNumber: orderId.split(",")[1],
            },
          }
        );
        res.json({
            status: true,
        });
      }
    }
  }else {
    res.json({
        status: false,
    });
  }
  //   // const data = req.body;
  //   // const orderId = req.params.orderId;
  //   // const uid = req.params.uid;
  //   // const decoded = jwt.decode(data.payload)
  // if (decoded.respDesc == "Success") {
  //     let invoiceNo = Encrypt.DecodeKey(decoded.invoiceNo)
  //     let referenceNo = decoded.referenceNo

  //     const _tbOrderHD = await tbOrderHD.update({
  //         transetionId: referenceNo,
  //         paymentDate: new Date(),
  //         paymentStatus: 3
  //     },{ where: { id: Encrypt.DecodeKey(invoiceNo.split(",")[0]), orderNumber: invoiceNo.split(",")[1] }});
  // }
});

module.exports = router;
