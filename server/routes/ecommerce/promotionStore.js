const express = require("express");
const router = express.Router();
const { tbPromotionStore } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbPromotionStore.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbPromotionStore: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbPromotionStore.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbPromotionStore: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbPromotionStore.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbPromotionStore: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbPromotionStore.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbPromotionStore.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbPromotionStore: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbPromotionStore.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbPromotionStore: null });
});

module.exports = router;
