const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../../services/crypto");
const Encrypt = new ValidateEncrypt();

const Sequelize = require("sequelize");
const { tbOrderHD, tbMember, tbOrderDT, tbStock } = require("../../../models");

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
    } catch (e) {
        status = false
        msg = e.message
    }
    return res.json({
        status: status,
        msg: msg,
        orderId: orderId
    });
});
router.post("/getOrderHD", validateLineToken, async (req, res) => {

    let status = true;
    let msg;
    let Member;
    let { PaymentStatus, TransportStatus, isCancel, isReturn } = req.body
    let OrderHDData;
    let OrderHD = []
    try {
        const uid = Encrypt.DecodeKey(req.user.uid);
        Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
        if (Member) {


            if (PaymentStatus == "Wating" && TransportStatus == "Prepare" && !isCancel && !isReturn) {
                ///ที่ต้องชำระ
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: isCancel,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });
            } else if (PaymentStatus == "Done" && TransportStatus == "Prepare") {
                //เตรียมสินค้า
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: false,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus
                    }
                });
            } else if (PaymentStatus == "Done" && TransportStatus == "In Transit") {
                //ที่ต้องได้รับ
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: false,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });
            }
            else if (PaymentStatus == "Done" && TransportStatus == "Done" && !isReturn) {
                //สำเร็จ
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: false,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });
            }
            else if (PaymentStatus == "Wating" && TransportStatus == "Prepare" && isCancel && !isReturn) {
                //ยกเลิก
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: isCancel,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });
            }
            else if (PaymentStatus == "Done" && TransportStatus == "Done" && !isCancel && isReturn) {
                //คืนสินค้า
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber",],
                    where: {
                        isCancel: isCancel,
                        IsDeleted: false,
                        memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });
            }
            if (OrderHDData) {
                for (var i = 0; i < OrderHDData.length; i++) {
                    let hd = OrderHDData[i].dataValues

                    hd.dt = []
                    const OrderDTData = await tbOrderDT.findAll({
                        attributes: ["id", "amount", "price", "discount", "discountType", "stockId", "orderId"],
                        where: { IsDeleted: false, orderId: hd.id }
                    });
                    for (var j = 0; j < OrderDTData.length; j++) {
                        let dt = OrderDTData[j].dataValues
                        dt.id = Encrypt.EncodeKey(dt.id)
                        const _tbStock = await tbStock.findOne({ attributes: ["id", "productName", "discount", "discountType", "price"], where: { id: dt.stockId } });
                        dt.stockId = Encrypt.EncodeKey(dt.stockId)
                        dt.stock = _tbStock
                        hd.dt.push(dt)
                    }
                    hd.id = Encrypt.EncodeKey(hd.id)
                    OrderHD.push(hd)
                }
            }

        }

    } catch (e) {
        status = false
        msg = e.message
    }

    return res.json({
        status: status,
        msg: msg,
        OrderHD: OrderHD
    });
});

//#endregion line liff
module.exports = router;
