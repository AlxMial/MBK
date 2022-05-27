const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { tbReturnOrder } = require("../../models");

router.post("/", validateToken, async (req, res) => {
    const data = await tbReturnOrder.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbReturnOrder: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbReturnOrder.findAll({
        where: { isDeleted: false },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        select sum(price) from tbstocks t 
                            where id in (select stockId from tborderdts t2 
				                            where isDeleted=0
				                            and orderId = tbReturnOrder.orderId)
                    )`),
                    "sumPrice",
                ]
            ],
        },
    });
    res.json({
        status: true,
        message: "success",
        tbReturnOrder: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbReturnOrder.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbReturnOrder: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbReturnOrder.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbReturnOrder.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbReturnOrder: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbReturnOrder.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbReturnOrder: null });
});

module.exports = router;
