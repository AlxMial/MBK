const express = require("express");
const router = express.Router();
const { tbBanner } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbBanner.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbBanner: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbBanner.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbBanner: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbBanner.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbBanner: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbBanner.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    if (!data) {
        const dataUpdate = await tbBanner.update(req.body, {
            where: { id: req.body.id },
        });
        res.json({
            status: true,
            message: "success",
            tbBanner: dataUpdate,
        });
    } else {
        res.json({
            status: false,
            message: "success",
            tbBanner: null,
        });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbBanner.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbBanner: null });
});

module.exports = router;
