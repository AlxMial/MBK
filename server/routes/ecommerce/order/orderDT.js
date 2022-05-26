const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const { tbOrderDT } = require("../../../models");

const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbOrderDT.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbOrderDT: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbOrderDT.findAll({
        where: { isDeleted: false },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        select sum(price) from tbstocks t 
                            where id in (select stockId from tborderdts t2 
				                            where isDeleted=0
				                            and orderId = tbOrderDT.orderId)
                    )`),
                    "sumPrice",
                ],
                [
                    Sequelize.literal(`(
                        select image from tbimages t
                            where relatedId = tbOrderDT.stockId
                            and relatedTable = 'stock'
                            and isDeleted = 0
                    )`),
                    "image",
                ],
                [
                    Sequelize.literal(`(
                        select imageName from tbimages t
                            where relatedId = tbOrderDT.stockId
                            and relatedTable = 'stock'
                            and isDeleted = 0
                    )`),
                    "imageName",
                ],
            ],
        },
    });
    res.json({
        status: true,
        message: "success",
        tbOrderDT: data,
    });
});

router.get("/byOrderId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbOrderDT.findAll({
        where: { orderId: id },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        select image from tbimages t
                            where relatedId = tbOrderDT.stockId
                            and relatedTable = 'stock1'
                            and isDeleted = 0
                    )`),
                    "image",
                ],
                [
                    Sequelize.literal(`(
                        select productName from tbstocks t
                            where id = tbOrderDT.stockId
                            and isDeleted = 0
                    )`),
                    "productName",
                ],
                [
                    Sequelize.literal(`(
                        select description from tbstocks t
                            where id = tbOrderDT.stockId
                            and isDeleted = 0
                    )`),
                    "description",
                ],
                [
                    Sequelize.literal(`(
                        select price from tbstocks t
                            where id = tbOrderDT.stockId
                            and isDeleted = 0
                    )`),
                    "price",
                ],
            ],
        },
    });
    res.json({
        status: true,
        message: "success",
        tbOrderDT: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbOrderDT.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbOrderDT: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbOrderDT.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbOrderDT.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbOrderDT: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbOrderDT.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbOrderDT: null });
});

module.exports = router;
