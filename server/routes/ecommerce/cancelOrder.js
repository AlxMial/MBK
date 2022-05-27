const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const { tbCancelOrder } = require("../../models");
const Op = Sequelize.Op;

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
                ]
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

module.exports = router;
