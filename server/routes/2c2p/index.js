const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const {
    tbOrderHD,
} = require("../../models");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", async (req, res) => {
    const data = req.body;

    const decoded = jwt.decode(data.payload)

    if (decoded.respDesc == "Success") {
        let invoiceNo = Encrypt.DecodeKey(decoded.invoiceNo)
        let referenceNo = decoded.referenceNo

        const _tbOrderHD = await tbOrderHD.update({
            transetionId: referenceNo,
            paymentDate: new Date(),
            paymentStatus: "Done"
        },
            { where: { id: Encrypt.DecodeKey(invoiceNo.split(",")[0]), orderNumber: invoiceNo.split(",")[1] } });
    }
});


module.exports = router;
