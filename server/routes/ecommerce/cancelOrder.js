const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const { tbCancelOrder } = require("../../models");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
    const data = await tbCancelOrder.create(req.body);
    res.json({
        status: true,
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
                        select sum(price) from tbstocks t 
                            where id in (select stockId from tborderdts t2 
				                            where isDeleted=0
				                            and orderId = tbCancelOrder.orderId)
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
            }
        },
    });

    const dataUpdate = await tbCancelOrder.update(req.body, {
        where: { id: req.body.id },
    });
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
    let status = true
    let msg = ""
    try {

        const data = await tbCancelOrder.create({ orderId: Encrypt.DecodeKey(orderId), cancelStatus: "Wait", cancelType: "User", cancelDetail: cancelDetail, description: description, isDeleted: false });

    } catch (e) {
        status = false
        msg = e.message
    }

    res.json({
        status: status,
        message: msg,
        tbCancelOrder: req.body,
    });
});
//#endregion line liff
module.exports = router;
