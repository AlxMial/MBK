const express = require("express");
const router = express.Router();
const { tbLogistic } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbLogistic.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbLogistic.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbLogistic.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbLogistic: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbLogistic.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbLogistic.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbLogistic: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbLogistic.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbLogistic: null });
});

module.exports = router;
