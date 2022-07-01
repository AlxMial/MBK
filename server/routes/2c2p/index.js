const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {

    let secretKey = '0181112C92043EA4AD2976E082A3C5F20C1137ED39FFC5D651C7A420BA51AF22'

    let payload = {
        "merchantID": '764764000011180',
        "invoiceNo": 'xxx456xx-xxx',
        "description": "item 1",
        "amount": '299.00',
        "currencyCode": "THB",
        "request3DS": "Y",
        "backendReturnUrl": "http://example.org/backendReturnUrl",
        "frontendReturnUrl": "http://example.org/frontendReturnUrl"
    }

    //api 2c2p https://sandbox-pgw.2c2p.com/payment/4.1/PaymentToken {{payload : "token"}}

    //payload : payload

    //webPaymentUrl window.open

    const token = jwt.sign(payload, secretKey);

    res.json({
        status: token,
    });
});


module.exports = router;
