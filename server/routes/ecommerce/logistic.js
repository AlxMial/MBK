const express = require("express");
const router = express.Router();
const { tbLogistic, tbPromotionDelivery } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbLogistic.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbLogistic.findAll({
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        SELECT logisticCategory
                        FROM tblogisticcategories
                        WHERE
                            tblogisticcategories.id = tbLogistic.logisticCategoryId
                    )`),
                    'logisticCatagoryName'
                ]
            ]
        },
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbLogistic.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbLogistic.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbLogistic.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbLogistic: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbLogistic.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbLogistic: null });
});

//#region line liff
router.get("/gettbLogistic", validateLineToken, async (req, res) => {
    let LogisticData = []
    let PromotionDelivery = null
    let status = true
    let message = ""
    try {
        //#region tbLogistic
        const _tbLogistic = await tbLogistic.findAll({
            attributes: ["id", "logisticType", "deliveryName", "description", "deliveryCost"],
            where: { isDeleted: false, isShow: true },
        });
        if (_tbLogistic) {
            _tbLogistic.map((e, i) => {
                LogisticData.push({ id: Encrypt.EncodeKey(e.id), logisticType: e.logisticType, deliveryName: e.deliveryName, description: e.description, deliveryCost: e.deliveryCost })
            })
        }
        //#endregion tbLogistic
        //#region tbLogistic

        const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
            attributes: ["id", "promotionName", "buy", "deliveryCost", "deliveryCost"],
            where: { isDeleted: false, isInactive: true },
        });
        if (_tbPromotionDelivery) {
            Encrypt.encryptValueId(_tbPromotionDelivery)
            PromotionDelivery = _tbPromotionDelivery
        }
        //#endregion tbLogistic

    } catch (e) {
        status = false
        message = e.message
    }
    res.json({
        status: status,
        message: message,
        tbLogistic: LogisticData,
        tbPromotionDelivery: PromotionDelivery
    });
});

//#endregion line liff
module.exports = router;
