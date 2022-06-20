const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../../services/crypto");
const Encrypt = new ValidateEncrypt();

const Sequelize = require("sequelize");
const { tbOrderHD, tbMember, tbOrderDT } = require("../../../models");

const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbOrderHD.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbOrderHD: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbOrderHD.findAll({
        where: { isDeleted: false },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        select sum(price) from tbstocks t 
                            where id in (select stockId from tborderdts t2 
				                            where isDeleted=0
				                            and orderId = tbOrderHD.id)
                    )`),
                    "sumPrice",
                ],
                [
                    Sequelize.literal(`(
                        select image from tbimages t
                            where relatedId = tbOrderHD.id
                            and relatedTable = 'order'
                            and isDeleted = 0
                    )`),
                    "image",
                ],
                [
                    Sequelize.literal(`(
                        select imageName from tbimages t
                            where relatedId = tbOrderHD.id
                            and relatedTable = 'order'
                            and isDeleted = 0
                    )`),
                    "imageName",
                ],
                [
                    Sequelize.literal(`(
                        select deliveryCost from tblogistics t
                            where id = tbOrderHD.logisticId
                            and isDeleted = 0
                    )`),
                    "deliveryCost",
                ],
                [
                    Sequelize.literal(`(
                        select logisticType from tblogistics t
                            where id = tbOrderHD.logisticId
                            and isDeleted = 0
                    )`),
                    "logisticType",
                ],
                [
                    Sequelize.literal(`(
                        select sum(weight) from tbstocks t 
                            where id in (select stockId from tborderdts t2 
				                            where t2.isDeleted=0
				                            and t2.orderId = tbOrderHD.id)
                    )`),
                    "sumWeight",
                ],
            ],
        },
    });
    res.json({
        status: true,
        message: "success",
        tbOrderHD: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbOrderHD.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbOrderHD: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbOrderHD.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbOrderHD.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbOrderHD: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbOrderHD.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbOrderHD: null });
});



//#region line liff

router.post("/doSaveOrder", validateLineToken, async (req, res) => {
    let status = true;
    let msg;
    const uid = Encrypt.DecodeKey(req.user.uid);
    let Member;
    let orderId;
    let { orderhd, orderdt } = req.body
    try {

        Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
        orderhd.memberId = Member.id
        orderhd.orderDate = new Date()
        orderhd.paymentId = Encrypt.DecodeKey(orderhd.paymentId)
        orderhd.logisticId = Encrypt.DecodeKey(orderhd.logisticId)
        const _tbOrderHD = await tbOrderHD.create(orderhd);

        if (_tbOrderHD) {
            orderId = Encrypt.EncodeKey(_tbOrderHD.dataValues.id)
            for (var i = 0; i < orderdt.length; i++) {
                orderdt[i].stockId = Encrypt.DecodeKey(orderdt[i].stockId)
                orderdt[i].orderId = _tbOrderHD.dataValues.id
                const _tbOrderDT = await tbOrderDT.create(orderdt[i]);
            }
        }


        // data.dataValues.id
        // console.log()


    } catch (e) {
        status = false
        msg = e.message
    }
    // const data = await tbOrderHD.create(req.body);

    return res.json({
        status: status,
        msg: msg,
        orderId: orderId
    });
});


//#endregion line liff
module.exports = router;
