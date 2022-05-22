const express = require("express");
const router = express.Router();
const { tbPayment } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbPayment.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbPayment: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbPayment.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbPayment: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbPayment.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbPayment: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbPayment.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    if (!data) {
        const dataUpdate = await tbPayment.update(req.body, {
            where: { id: req.body.id },
        });
        res.json({
            status: true,
            message: "success",
            tbPayment: dataUpdate,
        });
    } else {
        res.json({
            status: false,
            message: "success",
            tbPayment: null,
        });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbPayment.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbPayment: null });
});

module.exports = router;
