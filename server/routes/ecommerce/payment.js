const express = require("express");
const router = express.Router();
const { tbPayment } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const jwt = require('jsonwebtoken');
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
    const data = await tbPayment.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    if (!data) {
        const dataUpdate = await tbPayment.update(req.body, {
            where: { id: req.body.id },
        });
        res.json({
            status: true,
            message: "success",
            tbPayment: dataUpdate,
        });
    } else {
        res.json({
            status: false,
            message: "success",
            tbPayment: null,
        });
    }
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
    let code = 200
    let option = []
    try {
        const data = await tbPayment.findAll({
            attributes: ["id", "accountName", "accountNumber", "bankBranchName", "bankName"],
            where: { isDeleted: false },
        });

        if (data) {
            data.map(e => {
                option.push({ id: Encrypt.EncodeKey(e.id), accountName: e.accountName, accountNumber: e.accountNumber, bankBranchName: e.bankBranchName, bankName: e.bankName });
            })
        }

    } catch (e) {
        code = 300;
    }

    res.json({
        code: code,
        tbPayment: option,
    });

});
//#endregion line liff

module.exports = router;
