const express = require("express");
const router = express.Router();
const { tbShop } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbShop.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbShop: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbShop.findOne({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbShop: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbShop.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbShop: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbShop.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    if (!data) {
        const dataUpdate = await tbShop.update(req.body, {
            where: { id: req.body.id },
        });
        res.json({
            status: true,
            message: "success",
            tbShop: dataUpdate,
        });
    } else {
        res.json({
            status: false,
            message: "success",
            tbShop: null,
        });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbShop.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbShop: null });
});

module.exports = router;
