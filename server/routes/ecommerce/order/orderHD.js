const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../../services/crypto");
const Encrypt = new ValidateEncrypt();

const Sequelize = require("sequelize");
const { tbOrderHD, tbMember, tbOrderDT, tbStock, tbLogistic, tbPromotionDelivery, tbPayment, tbRedemptionCoupon, tbCouponCode, tbCancelOrder, tbReturnOrder } = require("../../../models");
// const tbReturnOrder = require("../../../models/tbReturnOrder");

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
    let OrderHDData = [];
    let OrderHD = []
    try {
        const uid = Encrypt.DecodeKey(req.user.uid);
        Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
        if (Member) {


            if (PaymentStatus == "Wating" && TransportStatus == "Prepare" && !isCancel && !isReturn) {
                ///ที่ต้องชำระ
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
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
                let _OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
                    where: {
                        isCancel: false,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus
                    }
                });
                if (_OrderHDData) {
                    for (var i = 0; i < _OrderHDData.length; i++) {
                        const _tbCancelOrder = await tbCancelOrder.findOne({
                            attributes: ["id", "orderId"],
                            where: {
                                IsDeleted: false,
                                orderId: _OrderHDData[i].id
                            }
                        });
                        if (_tbCancelOrder == null) {
                            OrderHDData.push(_OrderHDData[i])
                        }
                    }

                }

            } else if (PaymentStatus == "Done" && TransportStatus == "In Transit") {
                //ที่ต้องได้รับ
                OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
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
                let _OrderHDData = await tbOrderHD.findAll({
                    attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
                    where: {
                        isCancel: false,
                        IsDeleted: false, memberId: Member.id,
                        paymentStatus: PaymentStatus,
                        transportStatus: TransportStatus,
                        isReturn: isReturn
                    }
                });

                if (_OrderHDData) {
                    for (var i = 0; i < _OrderHDData.length; i++) {
                        const _tbReturnOrder = await tbReturnOrder.findOne({
                            attributes: ["id", "orderId", "returnStatus"],
                            where: {
                                IsDeleted: false,
                                orderId: _OrderHDData[i].id,
                                returnStatus: ["Wait", "Done", "Not Return"]
                            }
                        });
                        if (_tbReturnOrder == null) {
                            OrderHDData.push(_OrderHDData[i])
                        } else {
                            if (_tbReturnOrder.dataValues.returnStatus == "Not Return") {
                                _OrderHDData[i].dataValues.returnStatus = "Not Return"
                                OrderHDData.push(_OrderHDData[i])
                            }
                        }
                    }

                }

            }
            else if (PaymentStatus == "Wating" && TransportStatus == "Prepare" && isCancel && !isReturn) {
                //ยกเลิก
                // OrderHDData = []
                const _tbCancelOrder = await tbCancelOrder.findAll({
                    attributes: ["id", "orderId", "cancelStatus"],
                    where: {
                        IsDeleted: false,

                    }
                });
                if (_tbCancelOrder) {
                    for (var i = 0; i < _tbCancelOrder.length; i++) {
                        const _tbOrderHD = await tbOrderHD.findOne({
                            attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
                            where: {
                                IsDeleted: false,
                                id: _tbCancelOrder[i].orderId,
                                memberId: Member.id,
                            }
                        });
                        if (_tbOrderHD != null) {
                            _tbOrderHD.dataValues.cancelStatus = _tbCancelOrder[i].cancelStatus
                            OrderHDData.push({ dataValues: _tbOrderHD.dataValues })
                        }
                    }
                }

            }
            else if (PaymentStatus == "Done" && TransportStatus == "Done" && !isCancel && isReturn) {
                //คืนสินค้า

                const _tbReturnOrder = await tbReturnOrder.findAll({
                    attributes: ["id", "orderId", "returnStatus"],
                    where: {
                        IsDeleted: false,
                        returnStatus: ["Wait", "Done", "Not Return"]
                    }
                });

                if (_tbReturnOrder) {
                    for (var i = 0; i < _tbReturnOrder.length; i++) {
                        const _tbOrderHD = await tbOrderHD.findOne({
                            attributes: ["id", "orderNumber", "logisticId", "paymentId", "stockNumber", "couponCodeId"],
                            where: {
                                IsDeleted: false,
                                id: _tbReturnOrder[i].orderId,
                                memberId: Member.id,
                            }
                        });
                        if (_tbOrderHD != null) {
                            _tbOrderHD.dataValues.returnStatus = _tbReturnOrder[i].returnStatus
                            OrderHDData.push({ dataValues: _tbOrderHD.dataValues })
                        }
                    }
                }
            }
            if (OrderHDData) {
                for (var i = 0; i < OrderHDData.length; i++) {
                    let hd = OrderHDData[i].dataValues

                    hd.dt = []
                    let amount = 0
                    let price = 0
                    const OrderDTData = await tbOrderDT.findAll({
                        attributes: ["id", "amount", "price", "discount", "discountType", "stockId"
                            // , "orderId"
                        ],
                        where: { IsDeleted: false, orderId: hd.id }
                    });

                    for (var j = 0; j < OrderDTData.length; j++) {
                        let dt = OrderDTData[j].dataValues
                        dt.id = Encrypt.EncodeKey(dt.id)
                        const _tbStockData = await tbStock.findOne({ attributes: ["id", "productName", "discount", "discountType", "price"], where: { id: dt.stockId } });
                        let _tbStock = _tbStockData.dataValues
                        dt.productName = _tbStock.productName
                        dt.discount = parseFloat(_tbStock.discount) > 0 ? _tbStock.discountType == "THB" ? (parseFloat(_tbStock.price) - parseFloat(_tbStock.discount))
                            : (parseFloat(_tbStock.price) - ((parseFloat(_tbStock.discount) / 100) * (parseFloat(_tbStock.price)))) : 0;
                        dt.price = parseFloat(_tbStock.price)
                        amount += dt.amount
                        hd.dt.push({ id: Encrypt.EncodeKey(dt.stockId), price: dt.price, discount: dt.discount, productName: dt.productName, amount: dt.amount })

                        price += (dt.discount > 0 ? dt.discount : dt.price) * dt.amount

                    }

                    const _tbLogistic = await tbLogistic.findOne({
                        attributes: ["id", "logisticType", "deliveryName", "description", "deliveryCost"],
                        where: {
                            isDeleted: false, id:
                                hd.logisticId
                        },
                    });
                    let deliveryCost = 0
                    let Coupondiscount = 0


                    if (hd.couponCodeId != null) {

                        tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
                        tbCouponCode.belongsTo(tbRedemptionCoupon, { foreignKey: "redemptionCouponId" });
                        const _tbRedemptionCoupon = await tbCouponCode.findOne({
                            where: { id: hd.couponCodeId },
                            attributes: ['redemptionCouponId'],
                            include: [
                                {
                                    model: tbRedemptionCoupon,
                                    attributes: ['id', 'discount', "isNotExpired", "startDate", "expiredDate", "couponName"],
                                    where: {
                                        isDeleted: !1,
                                        id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
                                    },
                                },
                            ],
                        });
                        if (_tbRedemptionCoupon) {
                            Coupondiscount = _tbRedemptionCoupon.dataValues.tbRedemptionCoupon.dataValues.discount
                        }

                    }
                    price = Coupondiscount > price ? 0 : price - Coupondiscount

                    if (_tbLogistic) {
                        deliveryCost = _tbLogistic.dataValues.deliveryCost
                        if (deliveryCost > 0) {
                            const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
                                attributes: ["id", "promotionName", "buy", "deliveryCost", "deliveryCost"],
                                where: { isDeleted: false, isInactive: true },
                            });
                            if (_tbPromotionDelivery) {
                                if (price > _tbPromotionDelivery.buy) {
                                    let promodeliveryCost = _tbPromotionDelivery.dataValues.deliveryCost
                                    if (promodeliveryCost > deliveryCost) {
                                        deliveryCost = 0
                                    } else {
                                        deliveryCost = deliveryCost - promodeliveryCost
                                    }

                                }
                            }
                        }
                    }
                    price += deliveryCost


                    hd.amount = amount
                    hd.price = price
                    hd.id = Encrypt.EncodeKey(hd.id)
                    OrderHD.push({ id: hd.id, orderNumber: hd.orderNumber, amount: hd.amount, price: hd.price, returnStatus: hd.returnStatus, dt: hd.dt })
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

router.post("/getOrder", validateLineToken, async (req, res) => {

    let status = true;
    let msg;
    let Member;
    let { orderId } = req.body
    let OrderHDData;
    let OrderHD;
    try {
        const uid = Encrypt.DecodeKey(req.user.uid);
        Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
        if (Member) {
            OrderHDData = await tbOrderHD.findOne({
                attributes: ["id", "logisticId", "paymentId"],
                where: {
                    id: Encrypt.DecodeKey(orderId),
                    isCancel: false,
                    IsDeleted: false, memberId: Member.id,
                    paymentStatus: "Wating",
                    transportStatus: "Prepare",
                    isReturn: false
                }
            });
            let sumprice = 0
            if (OrderHDData) {
                const OrderDTData = await tbOrderDT.findAll({
                    attributes: ["id", "amount", "price", "discount", "discountType", "stockId", "orderId"],
                    where: { IsDeleted: false, orderId: OrderHDData.dataValues.id }
                });
                // ลดราคา    
                for (var j = 0; j < OrderDTData.length; j++) {
                    let dt = OrderDTData[j].dataValues
                    //ลดราคา 
                    if (dt.discount > 0) {
                        let price = 0;
                        if (dt.discountType === 'Percent') {
                            price = dt.price - ((dt.discount / 100) * dt.price)
                        } else {
                            price = dt.price - dt.discount
                        }
                        sumprice = sumprice + (price * dt.amount)
                    } else {

                        sumprice = sumprice + (dt.price * dt.amount)
                    }
                }
                // คูปอง

                // ค่าขนส่ง 
                const _tbLogistic = await tbLogistic.findOne({
                    attributes: ["id", "logisticType", "deliveryName", "description", "deliveryCost"],
                    where: {
                        isDeleted: false, id:
                            OrderHDData.dataValues.logisticId
                    },
                });
                //โปรโมชั่นขนส่ง
                const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
                    attributes: ["id", "promotionName", "buy", "deliveryCost", "deliveryCost"],
                    where: { isDeleted: false, isInactive: true },
                });
                if (_tbLogistic && _tbPromotionDelivery) {
                    let _tbPromotionDeliveryData = _tbPromotionDelivery.dataValues
                    let LogisticData = _tbLogistic.dataValues

                    if (_tbPromotionDeliveryData.buy >= sumprice) {
                        sumprice = sumprice + LogisticData.deliveryCost
                    } else {
                        let deliveryCostt = LogisticData.deliveryCost
                        if (deliveryCostt > _tbPromotionDeliveryData.deliveryCost) {
                            deliveryCost = deliveryCostt - _tbPromotionDeliveryData.deliveryCost
                        } else {
                            deliveryCostt = 0
                        }
                        sumprice = sumprice + deliveryCostt
                    }
                }

                const _tbPayment = await tbPayment.findOne({
                    attributes: ["id", "accountName", "accountNumber", "bankBranchName", "bankName"],
                    where: { isDeleted: false, id: OrderHDData.dataValues.paymentId },
                });

                OrderHD = { id: Encrypt.EncodeKey(OrderHDData.dataValues.id), price: sumprice, Payment: _tbPayment }
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


router.post("/getOrderHDById", validateLineToken, async (req, res) => {

    let status = true;
    let msg;
    let Member;
    let { Id } = req.body
    let OrderHDData;
    let OrderHD;
    try {
        const uid = Encrypt.DecodeKey(req.user.uid);
        Member = await tbMember.findOne({ attributes: ["id"], where: { uid: uid } });
        if (Member) {

            OrderHDData = await tbOrderHD.findOne({
                attributes: ["id"
                    , "orderNumber"
                    , "paymentType"
                    , "paymentStatus"
                    , "transportStatus"
                    , "isCancel"
                    , "isReturn"
                    , "logisticId"
                    , "memberId"
                    , "paymentId"
                    , "couponCodeId"
                    , "orderDate"
                    , "paymentDate"],
                where: {
                    IsDeleted: false, id: Encrypt.DecodeKey(Id),
                }
            });


            if (OrderHDData) {

                let hd = OrderHDData.dataValues
                hd.dt = []
                const OrderDTData = await tbOrderDT.findAll({
                    attributes: ["id", "amount", "price", "discount", "discountType", "stockId", "orderId"],
                    where: { IsDeleted: false, orderId: hd.id }
                });

                for (var j = 0; j < OrderDTData.length; j++) {
                    let dt = OrderDTData[j].dataValues
                    dt.id = Encrypt.EncodeKey(dt.id)
                    const _tbStockData = await tbStock.findOne({ attributes: ["id", "productName", "discount", "discountType", "price"], where: { id: dt.stockId } });
                    dt.stockId = Encrypt.EncodeKey(dt.stockId)
                    let _tbStock = _tbStockData.dataValues
                    _tbStock.id = Encrypt.EncodeKey(_tbStock.id)
                    dt.stock = _tbStock
                    hd.dt.push(dt)
                }

                const _tbLogistic = await tbLogistic.findOne({
                    attributes: ["id", "logisticType", "deliveryName", "description", "deliveryCost"],
                    where: { isDeleted: false, isShow: true, id: hd.logisticId },
                });
                //โปรโมชั่นขนส่ง
                const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
                    attributes: ["id", "promotionName", "buy", "deliveryCost", "deliveryCost"],
                    where: { isDeleted: false, isInactive: true },
                });
                // couponCodeId
                if (hd.couponCodeId != null) {
                    tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
                    tbCouponCode.belongsTo(tbRedemptionCoupon, { foreignKey: "redemptionCouponId" });
                    const _tbRedemptionCoupon = await tbCouponCode.findOne({
                        where: { id: hd.couponCodeId },
                        attributes: ['redemptionCouponId'],
                        include: [
                            {
                                model: tbRedemptionCoupon,
                                attributes: ['id', 'discount', "isNotExpired", "startDate", "expiredDate", "couponName"],
                                where: {
                                    isDeleted: !1,
                                    id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
                                },
                            },
                        ],
                    });
                    hd.RedemptionCoupon = _tbRedemptionCoupon.dataValues
                }

                const _tbCancelOrder = await tbCancelOrder.findOne({
                    attributes: ["id", "cancelStatus", "cancelType", "cancelDetail", "description", "createdAt"],
                    where: { isDeleted: false, orderId: hd.id },
                });

                if (_tbCancelOrder) {
                    _tbCancelOrder.dataValues.id = Encrypt.EncodeKey(_tbCancelOrder.id)
                    hd.tbCancelOrder = _tbCancelOrder
                }


                const _tbReturnOrder = await tbReturnOrder.findOne({
                    attributes: ["id", "returnStatus", "returnType", "returnDetail", "description", "createdAt"],
                    where: { isDeleted: false, orderId: hd.id },
                });

                if (_tbReturnOrder) {
                    _tbReturnOrder.dataValues.id = Encrypt.EncodeKey(_tbReturnOrder.id)
                    hd.tbReturnOrder = _tbReturnOrder
                }


                hd.id = Encrypt.EncodeKey(hd.id)
                hd.paymentId = Encrypt.EncodeKey(hd.paymentId)
                hd.logisticId = Encrypt.EncodeKey(hd.logisticId)
                hd.deliveryCost = _tbLogistic.dataValues.deliveryCost
                hd.PromotionDelivery = _tbPromotionDelivery.dataValues
                OrderHD = hd

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
