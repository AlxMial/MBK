const express = require("express");
const router = express.Router();
const { tbStock, tbBanner, tbImage } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbStock.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbStock: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbStock.findAll({
        where: { isDeleted: false },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        select count(dt.id) buy from tborderdts dt
                        where isDeleted = 0 
                        and orderId 
                            in (select hd.id from tborderhds hd 
                            where hd.isDeleted = 0 
                            and hd.paymentStatus = 'Done'
                            and not exists(select 1 from tbcancelorders where isDeleted = 0
                                            and cancelStatus = 'wait'))
                )`),
                    "buy",
                ],
                [
                    Sequelize.literal(`(
                        select categoryName from tbproductcategories t
                        where isDeleted = 0 and id = tbStock.productCategoryId
                )`),
                    "categoryName",
                ],
            ],
        },
    });
    res.json({
        status: true,
        message: "success",
        tbStock: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbStock.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbStock: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbStock.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbStock.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbStock: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbStock.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbStock: null });
});

// line liff

router.post("/getStock", validateLineToken, async (req, res) => {

    let id = req.body.id;

    let status = true;
    let _tbStock = []
    let msg = null
    let data;
    try {

        if (Encrypt.IsNullOrEmpty(id)) {
            data = await tbStock.findAll({
                where: { isDeleted: false, isInactive: true },
            });
        } else {
            let Id = []
            id.filter(e => {
                Id.push(Encrypt.DecodeKey(e))
            })
            data = await tbStock.findAll({
                where: { isDeleted: false, isInactive: true, id: Id },
            });
        }


        data.filter((e) => {
            let sale = (e.discountType.toLowerCase().includes("thb") ? e.discount : ((e.discount / e.price) * 100))
            _tbStock.push({
                id: Encrypt.EncodeKey(e.id),
                productName: e.productName,
                price: e.price,
                discount: e.discount,
                discountType: e.discountType,
                productCount: e.productCount,
                weight: e.weight,
                description: e.description,
                descriptionPromotion: e.descriptionPromotion,
                isFlashSale: e.isFlashSale,
                startDateCampaign: e.startDateCampaign,
                endDateCampaign: e.endDateCampaign,
                startTimeCampaign: e.startTimeCampaign,
                endTimeCampaign: e.endTimeCampaign,
                percent: e.discount > 0 ? ((e.discountType.toLowerCase().includes("percent") ? e.discount : ((e.discount / e.price) * 100))) : 0,
                priceDiscount: e.discount > 0 ? ((e.discountType.toLowerCase().includes("thb") ? e.price - e.discount : (e.price - ((e.discount / 100) * e.price)))) : 0
            })
        })
    } catch (e) {
        status = false
        msg = e.message
    }

    res.json({
        status: status,
        message: "success",
        msg: msg,
        tbStock: _tbStock,
    });
});
// รูป Banner
router.get("/getImgBanner", validateLineToken, async (req, res) => {
    tbBanner.hasMany(tbImage, { foreignKey: 'id' })
    tbImage.belongsTo(tbBanner, { foreignKey: 'relatedId' })
    const _tbBanner = await tbImage.findAll({
        where: { isDeleted: false }, include: [{
            model: tbBanner,
            where: {
                isDeleted: false, level: { [Op.col]: 'tbImage.relatedTable' }
            }
        }]
    })
    let data = [];
    _tbBanner.filter((e) => {
        data.push({
            id: Encrypt.EncodeKey(e.id), imageName: e.imageName, relatedId: Encrypt.EncodeKey(e.relatedId),
            relatedTable: e.relatedTable, typeLink: e.tbBanner.typeLink, shopId: Encrypt.EncodeKey(e.tbBanner.shopId),
            stockId: Encrypt.EncodeKey(e.tbBanner.stockId), image: e.image
        })
    })
    res.json({
        status: true,
        message: "success",
        ImgBanner: data,
    });
});
module.exports = router;
