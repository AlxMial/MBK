const express = require("express");
const router = express.Router();
const { tbPromotionDelivery } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbPromotionDelivery.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbPromotionDelivery: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbPromotionDelivery.findOne({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbPromotionDelivery: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbPromotionDelivery.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbPromotionDelivery: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbPromotionDelivery.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbPromotionDelivery.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbPromotionDelivery: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbPromotionDelivery.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbPromotionDelivery: null });
});

module.exports = router;
