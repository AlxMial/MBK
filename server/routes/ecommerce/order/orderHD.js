const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const { tbOrderHD } = require("../../../models");

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

module.exports = router;
